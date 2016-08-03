# == Schema Information
#
# Table name: posts
#
#  id            :integer          not null, primary key
#  message       :text
#  user_id       :integer
#  track_id      :integer
#  created_at    :datetime
#  updated_at    :datetime
#  listens_count :integer          default(0), not null
#  deleted_at    :datetime
#  parent_id     :integer
#  score         :float
#

class Post < ActiveRecord::Base
  paranoid

  belongs_to :user, counter_cache: true
  belongs_to :track
  has_many :comments
  has_many :listens
  has_many :favorites
  has_many :post_tags
  has_many :tags, through: :post_tags
  has_many :users, through: :listens, as: :listeners
  has_many :users, through: :favorites, as: :favoriters
  has_many :users, through: :comments, as: :commenters
  has_many :tag_notifications, class_name: 'TagNotification', dependent: :destroy
  has_one :trending_notification, dependent: :destroy
  has_one :repost_notification, dependent: :destroy

  belongs_to :parent, :class_name => "Post"
  has_many :reposts, :foreign_key => "parent_id", :class_name => "Post"

  has_one :video
  has_one :play_count_notification

  scope :liked_by_user, lambda { |user_id| joins(:favorites).where('favorites.user_id = ?', user_id).includes({comments: [:user]}, :track, :user, {favorites: [:user]}).order("favorites.created_at DESC") }
  scope :with_associated, lambda { includes({comments: [:user]}, :track, :user, {favorites: [:user]}, :reposts, :video) }
  scope :trending_with_associated, lambda { includes({comments: [:user]}, :track, :user, {favorites: [:user]}, :video) }

  def calculate_score!
    if self.created_at > 30.days.ago
      gravity = 0.7
      unique_comments = self.comments.map { |x| x.user_id }.uniq.count
      engagement = (0.3*self.listens_count)+(1*self.favorites.size)+(0.5*unique_comments)+(3*self.reposts.count)
      time = ((Time.now-self.created_at)/1.hour).round

      self.score = engagement/((time+2)**gravity)
      self.save!
    end

    notify_observers(:after_score_calculation)
  end
end
