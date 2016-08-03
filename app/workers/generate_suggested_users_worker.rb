class GenerateSuggestedUsersWorker
  include Sidekiq::Worker

  def perform(user_id)
    user = User.find_by_id(user_id)

    user.generate_suggested_users if user
  end
end