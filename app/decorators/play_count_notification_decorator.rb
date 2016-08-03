class PlayCountNotificationDecorator < Draper::Decorator
  def text
    "#{self.object.post.track.name} by #{self.object.post.track.artist} has #{self.object.play_count} plays!"
  end
end