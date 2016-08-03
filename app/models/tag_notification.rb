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

class TagNotification < Notification
  belongs_to :user
  belongs_to :comment
  belongs_to :post

  scope :with_associated, lambda { includes(:user, comment: [:user, :post], post: [:user]) }

  def icon
    if comment
      comment.user.icon
    else
      post.user.icon
    end
  end

  def target_url
    if comment
      "/posts/#{comment.post.id}"
    else
      "/posts/#{post.id}"
    end

  end
end
