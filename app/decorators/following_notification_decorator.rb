class FollowingNotificationDecorator < Draper::Decorator
  def text
    "#{self.object.following.follower.first_name} #{self.object.following.follower.last_name} is now following you"
  end
end