class UserObserver < ActiveRecord::Observer
  observe :user

  def after_create(user)
    user.generate_suggested_users
    UserNotificationWorker.perform_async(user.id)
  end
end