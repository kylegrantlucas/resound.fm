class FollowingNotificationWorker
  include Sidekiq::Worker

  def perform(following_id)
    following = Following.find_by_id(following_id)
    if following
      unless following.user.id == following.follower.id
        notification = FollowingNotification.create

        user = following.user

        notification.user = user
        notification.following = following

        notification.save

       # Pusher["private-#{user.id}"].trigger('new_notification', {:icon => notification.icon, :url => notification.target_url, :text => notification.decorate.text, :id => notification.id, :created_at => notification.created_at})
      end
    end
  end
end