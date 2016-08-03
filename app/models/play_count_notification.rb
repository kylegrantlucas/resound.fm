class PlayCountNotification < Notification
  belongs_to :post
  belongs_to :user

  def icon
    post.user.icon
  end

  def target_url
    "/posts/#{post.id}"
  end

  def play_count
    post.listens.size
  end
end