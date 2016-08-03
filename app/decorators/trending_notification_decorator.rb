class TrendingNotificationDecorator < Draper::Decorator
  def text
    "Your post has reached number #{self.object.highest_spot} on trending!"
  end
end