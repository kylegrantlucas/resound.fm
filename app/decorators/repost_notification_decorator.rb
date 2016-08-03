class RepostNotificationDecorator < Draper::Decorator
  def text
    repost = object.post
    "#{repost.user.first_name} #{repost.user.last_name} reposted your post #{repost.track.name} by #{repost.track.artist}"
  end
end
