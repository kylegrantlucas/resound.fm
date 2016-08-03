class BatchUserProfileImageWorker
  include Sidekiq::Worker
  include Sidetiq::Schedulable

  recurrence { hourly }

  def perform
    @oauth = Koala::Facebook::OAuth.new(ENV['FACEBOOK_KEY'], ENV['FACEBOOK_SECRET'])
    @graph = Koala::Facebook::API.new(@oauth.get_app_access_token)

    # Docs for batch fb calls: https://github.com/arsduo/koala/wiki/Batch-requests
    # Facebook limits batch requests to 50
    User.all.each_slice(50) do |users|
      users.each do |u|
          pictures = @graph.batch do |batch_api|
            batch_api.get_picture(u.fb_id, width: '200', height: '200')
          end
          u.icon = pictures.first if pictures
          u.save
      end  
    end
  end
end