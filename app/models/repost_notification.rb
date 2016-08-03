class RepostNotification < Notification
  belongs_to :post

  def target_url
    "/posts/#{post.id}"
  end

  def icon
    post.user.icon
  end
end
