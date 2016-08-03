# == Schema Information
#
# Table name: users
#
#  id                       :integer          not null, primary key
#  first_name               :string(255)      not null
#  last_name                :string(255)      not null
#  email                    :string(255)
#  gender                   :string(255)
#  fb_id                    :string(255)      not null
#  fb_token                 :string(255)      not null
#  fb_token_expiration      :datetime         not null
#  last_login               :datetime         not null
#  created_at               :datetime
#  updated_at               :datetime
#  theme_song_id            :integer
#  username                 :string(255)
#  registered               :boolean          default(FALSE)
#  bio                      :string(255)
#  feed_page_flash_id       :integer          default(1)
#  trending_page_flash_id   :integer          default(0)
#  user_page_flash_id       :integer          default(0)
#  user_page_bio_callout_id :integer          default(1)
#

class User < ActiveRecord::Base
  before_create :set_auth_token

  attr_accessor :skip_email

  has_many :posts
  has_many :comments
  has_many :favorites
  has_many :listens
  has_many :notifications
  has_many :followers, class_name: 'Following', foreign_key: 'user_id'
  has_many :following, class_name: 'Following', foreign_key: 'follower_id'
  belongs_to :theme_song, class_name: 'Track', foreign_key: 'theme_song_id'
  has_many :suggested_users, foreign_key: 'owner_id'
  has_many :suggested_to, class_name: 'SuggestedUser', foreign_key: 'suggested_user_id'


  # Checks for a valid username of the form:
  #   Beginning of string, at least 3 alphanumeric characters with periods allowed, end of string
  USERNAME_REGEX = /\A[a-z\d.]{3,}\z/i

  # User routes can either be a user or an id so the 3+ character rule doesn't apply
  USERNAME_ROUTE_REGEX = /[a-z\d.]+/i

  validates :username,
    format:     {with: USERNAME_REGEX,   message: "Usernames can use letters, numbers, and periods."},
    uniqueness: {case_sensitive: false,  message: "This username is taken"}

  validates :email, :email => {:allow_nil => true, :message => "isn't a valid address. Check for typos!"}, uniqueness: {case_sensitive: false, :message => "appears to be already associated with a different account."}, unless: :skip_email

  validates :bio, length: { maximum: 80 }

  scope :followers_by_user, lambda { |user_id| select('users.*').joins('INNER JOIN followings ON users.id = followings.follower_id').where('followings.user_id' => user_id) }

  include PgSearch
  pg_search_scope :search_by_full_name, :against => [:first_name, :last_name, :username], :using => { :tsearch => {:prefix => true} }


  def self.from_omniauth(auth)
    self.find_or_initialize_by(fb_id: auth.uid).tap do |user|
      if auth.provider == 'facebook'
        user.skip_email = true
        user.provider = 'facebook'
        user.username = (auth.info.nickname || auth.uid) unless user.username
        user.first_name = auth.info.first_name
        user.last_name = auth.info.last_name
        user.email = auth.info.email
        user.gender = auth.extra.raw_info.gender
        user.fb_id = auth.uid
        user.fb_token = auth.credentials.token
        user.fb_token_expiration = Time.at(auth.credentials.expires_at)
        user.last_login = Time.now
        user.save!
      elsif auth.provider == 'twitter'
        user.skip_email = true
        user.provider = 'twitter'
        user.username = (auth.info.nickname || auth.uid) unless user.username
        full_name = auth.info.name.split(' ')
        user.first_name = full_name.first if full_name && full_name.first
        user.last_name = full_name.last if full_name && full_name.last
        user.email = auth.info.email
        user.gender = nil
        user.fb_id = auth.uid
        user.fb_token = auth.credentials.token
        user.fb_token_expiration = nil
        user.last_login = Time.now
        user.icon = auth.info.image
        user.save!
      end
      
    end
  end

  def self.find_by_param(param)
    if param.to_i == 0
      User.where("lower(username) = ?", param.downcase).first
    else
      User.find(param)
    end
  end


  def admin?
    self.admin
  end


  def fb_icon200
    if self.icon
      self.icon.to_s.gsub('p50x50', 'p200x200')
    else
      self.fb_icon + "?height=200&width=200"
    end
  end

  def fb_icon
    self.icon ||= "https://graph.facebook.com/#{self.fb_id}/picture"
  end

  def create_post(post)
    if post[:track][:provider] == 'youtube'
      track = Track.find(post[:track][:id])
      video = Video.find(post[:video_id].to_i) if post[:video_id]
    else
      track = Track.find_by({provider: 'soundcloud', key: post[:track][:key].to_s})

      unless track
        soundcloud = SoundCloud.new({client_id: ENV['SOUNDCLOUD_ID']})
        raw_track = soundcloud.get("/tracks/#{post[:track][:key]}")

        if raw_track
          processed_track = SongUtils.process_soundcloud_song(raw_track)

          track = Track.create do |t|
            t.name = processed_track[:name]
            t.artist = processed_track[:artist]
            t.artist_id = processed_track[:artist_id]
            t.duration = processed_track[:duration]
            t.provider = 'soundcloud'
            t.key = processed_track[:key].to_s
            t.icon = processed_track[:icon100]
          end
        else
          return false
        end
      end
    end

    post_tags = []

    unless post[:message].nil?
      tags = BeatstreamText.extract_hashtags(post[:message])

      tags.each do |tag|
        post_tags << Tag.find_or_create_by(text: tag.downcase)
      end
    end

    track.extractColors

    post = self.posts.create do |p|
      p.message = post[:message]
      p.track = track
      p.video = video if video
      p.user = self
      p.tags = post_tags
    end
  end

  def follow (user_id)
    user_id = user_id.id if user_id.kind_of? User

    Following.create(user_id: user_id, follower_id: self.id)
  end

  def unfollow (user_id)
    user_id = user_id.id if user_id.kind_of? User

    Following.where(user_id: user_id, follower_id: self.id).destroy_all
  end

  def following_recommendations(limit=25)
    # Facebook friends who you haven't followed yet.
    users = self.existing_facebook_friends(true, limit)

    # People your followers are following who you haven't followed yet
    if (users.size < limit)
        users += self.second_degree_followings(limit - users.size)
    end

    # The top followed users on the site
    if (users.size < limit)
      users += self.top_followed.limit(limit - users.size)
    end

    users -= [self]
    users.uniq
  end

  def generate_suggested_users
    suggestions = following_recommendations(100)
    self.suggested_users.destroy_all

    suggestions.each do |s|
      SuggestedUser.create do |suggestion|
        suggestion.owner = self
        suggestion.suggested_user = s
      end
    end
  end

  def top_followed
    User.joins("INNER JOIN followings on followings.user_id = users.id")
        .group("users.id")
        .having("users.id NOT IN ( SELECT followers.user_id FROM followings AS followers WHERE followers.follower_id = ?)", self.id)
        .having("users.id != ?", self.id)
        .having("users.posts_count != 0")
        .order("count(*) DESC")
  end

  def second_degree_followings(limit=5)
    User.where("users.id IN (SELECT DISTINCT second.user_id AS user_id
                FROM followings AS first, followings AS second
                WHERE first.follower_id = ? AND second.user_id != ? AND first.user_id = second.follower_id AND second.user_id NOT IN (SELECT followers.user_id FROM followings AS followers WHERE followers.follower_id = ?)
                LIMIT ?) AND users.posts_count != 0", self.id, self.id, self.id, limit)
  end

  def existing_facebook_friends (only_unfollowed=false, limit=false)
    friends = []

    if fb_token_expiration > Time.now
      @graph = Koala::Facebook::API.new(self.fb_token)
      friend_ids = @graph.get_connections("me", "friends").map! {|user| user['id']}

      if only_unfollowed
        friends = User.where('users.fb_id IN (?) AND users.id NOT IN (?)', friend_ids, self.following.select('followings.user_id')).limit(limit)
      else
        friends = User.where(fb_id: friend_ids)
      end

    end

    return friends
  end

  private

  def set_auth_token
    return if auth_token.present?

    begin
      self.auth_token = SecureRandom.hex
    end while self.class.exists?(auth_token: self.auth_token)
  end

end
