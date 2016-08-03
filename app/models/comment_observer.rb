class CommentObserver < ActiveRecord::Observer
	observe :comment

	def after_create(comment)
    comment.post.calculate_score!
  end
end