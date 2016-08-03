class Api::SoundcloudController < Api::ApiController
  skip_before_filter :authenticate, :only => :show
  def show
    soundcloud = SoundCloud.new({client_id: ENV['SOUNDCLOUD_ID']})
    url = "#"
    
    begin
      raw_track = soundcloud.get("/tracks/#{params[:id]}")
      url = raw_track[:permalink_url]
    rescue
      url = "http://www.soundcloud.com/tracks/#{params[:id]}"
    end

    redirect_to url
  end
end
