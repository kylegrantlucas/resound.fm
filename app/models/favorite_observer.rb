class FavoriteObserver < ActiveRecord::Observer
	observe :favorite

	def after_create(favorite)
    favorite.post.calculate_score!
  end
end