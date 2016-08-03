class BatchCreateSuggestedUsersWorker
  include Sidekiq::Worker
  include Sidetiq::Schedulable

  recurrence { daily }

  def perform
    User.all.each do |u|
      GenerateSuggestedUsersWorker.perform_async(u.id)
    end
  end
end