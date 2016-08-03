class UserProfileImageWorker
  include Sidekiq::Worker

  def perform(user_id)
    user = User.find_by_id(user_id)

    if user
      @oauth = Koala::Facebook::OAuth.new(ENV['FACEBOOK_KEY'], ENV['FACEBOOK_SECRET'])
      @graph = Koala::Facebook::API.new(@oauth.get_app_access_token)

      user.icon = @graph.get_picture(user.fb_id) rescue Koala::Facebook::ClientError

      user.save
    end
  end
end