class FollowingObserver < ActiveRecord::Observer
	observe :following 

	def after_create(following)
  end
end