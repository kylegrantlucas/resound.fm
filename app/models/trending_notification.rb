class TrendingNotification < Notification
  belongs_to :user
  belongs_to :post

  def icon
      post.user.icon
  end

  def target_url
      "/posts/#{post.id}"
  end
end
