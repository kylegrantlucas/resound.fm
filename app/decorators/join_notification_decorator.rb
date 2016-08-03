class JoinNotificationDecorator < Draper::Decorator
  def text
    user = User.find(self.object.joiner_id)
    "#{user.first_name} #{user.last_name} has joined resound.fm"
  end
end