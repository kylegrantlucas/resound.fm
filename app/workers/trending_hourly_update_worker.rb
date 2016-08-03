class TrendingHourlyUpdateWorker
  include Sidekiq::Worker
  include Sidetiq::Schedulable

  recurrence { hourly }

  def perform
    Post.where('created_at > ?', 30.days.ago).each do |post|
      post.calculate_score!
    end

    Post.where('created_at < ?', 30.days.ago).each do |post|
      post.score = 0.0
      post.save!
    end
  end
end
