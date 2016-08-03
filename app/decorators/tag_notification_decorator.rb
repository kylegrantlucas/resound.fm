class TagNotificationDecorator < Draper::Decorator
  def text
    if object.comment
    "#{self.object.comment.user.first_name} #{self.object.comment.user.last_name} has tagged you in a comment"
    elsif object.post
      "#{self.object.post.user.first_name} #{self.object.post.user.last_name} has tagged you in a post"
    end
  end
end
