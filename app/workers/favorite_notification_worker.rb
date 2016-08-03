class FavoriteNotificationWorker
  include Sidekiq::Worker

  def perform(favorite_id)
    favorite = Favorite.find_by_id(favorite_id)

    if favorite
      unless favorite.user.id == favorite.post.user.id
        notification = FavoriteNotification.create

        user = favorite.post.user

        notification.favorite = favorite
        notification.user = user

        notification.save
        # Pusher["private-#{user.id}"].trigger('new_notification', {:icon => notification.icon, :url => notification.target_url, :text => notification.decorate.text, :id => notification.id, :created_at => notification.created_at})
      end
    end
  end
end