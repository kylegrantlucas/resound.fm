namespace :posts do
  task :hourly_score_update => :environment do
    Post.where('created_at > ?', 30.days.ago).each do |post|
      post.calculate_score!
    end

    Post.where('created_at < ?', 30.days.ago).each do |post|
      post.score = 0.0
      post.save!
    end
  end
end
