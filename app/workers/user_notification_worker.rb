class UserNotificationWorker
  include Sidekiq::Worker

  def perform(user_id)
    user = User.find_by_id(user_id)
    if user
      user.existing_facebook_friends.each do |friend|
        notification = JoinNotification.create
        notification.joiner_id = user.id
        notification.user = friend
        notification.save



       # Pusher["private-#{friend.id}"].trigger('new_notification', {:icon => notification.icon, :url => notification.target_url, :text => notification.decorate.text, :id => notification.id, :created_at => notification.created_at})
      end

      tracker = Staccato.tracker(ENV['GOOGLE_ANALYTICS_ID'])
      tracker.event(category: 'User', action: 'Joined', user_id: user_id)
    end
  end
end