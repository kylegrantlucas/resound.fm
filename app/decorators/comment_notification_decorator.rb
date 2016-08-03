class CommentNotificationDecorator < Draper::Decorator
  def text
    "#{self.object.comment.user.first_name} #{self.object.comment.user.last_name} commented on #{self.object.comment.post.track.name} by #{self.object.comment.post.track.artist}"
  end
end