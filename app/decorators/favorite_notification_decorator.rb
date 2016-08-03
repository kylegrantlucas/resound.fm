class FavoriteNotificationDecorator < Draper::Decorator
  def text
    favorite = Favorite.includes(:user, post: [:track]).find(object.favorite.id)
    "#{favorite.user.first_name} #{favorite.user.last_name} liked #{favorite.post.track.name} by #{favorite.post.track.artist}"
  end
end