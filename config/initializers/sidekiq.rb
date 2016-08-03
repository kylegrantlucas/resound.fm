if ENV['RAILS_ENV'] == 'production'
  Sidekiq.configure_server do |config|
    config.redis = { :url => 'redis://10.208.231.40:6379' }
  end

  Sidekiq.configure_client do |config|
    config.redis = { :url => 'redis://10.208.231.40:6379', }
  end
end
