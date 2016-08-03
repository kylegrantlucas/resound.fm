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

class CommentNotification < Notification
  belongs_to :comment

  scope :with_associated, lambda { includes(:comment, :user) }

  def target_url
    "/posts/#{comment.post.id}"
  end

  def icon
    comment.user.icon
  end
end
