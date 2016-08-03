# == Schema Information
#
# Table name: notifications
#
#  id              :integer          not null, primary key
#  category        :integer
#  user_id         :integer
#  comment_id      :integer
#  following_id    :integer
#  favorite_id     :integer
#  read_at         :datetime
#  target_url      :text
#  type            :string(255)
#  notification_id :integer
#  created_at      :datetime
#  updated_at      :datetime
#  joiner_id       :integer
#  post_id         :integer
#

class FollowingNotification < Notification
  belongs_to :following

  scope :with_associated, lambda { includes(:user, following: [:follower]) }

  def target_url
    "/users/#{following.follower.username}"
  end

  def icon
    following.follower.icon
  end
end
