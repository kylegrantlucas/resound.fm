class Api::MatchController < Api::ApiController
  def create
    @track = Track.find_by(itunes_id: params[:id].to_s)

    unless @track
      itunes_results = ITunesSearchAPI.lookup(id: params[:id])
      @track = SongUtils.process_itunes_song(itunes_results)
      query = "#{@track[:name].to_s} - #{@track[:artist].to_s}"
      @yt_client = YouTubeIt::Client.new
      results = @yt_client.videos_by({query: query, format:5, categories: {either: [:music, :entertainment]}, page: 1, per_page: 5}).videos

      if !results.empty?
        @track = Track.create do |a|
      	a.name = @track[:name]
        a.artist = @track[:artist]
        a.artist_id = @track[:artist_id]
        a.album = @track[:album]
        a.duration = @track[:duration]
        a.provider = 'youtube'
        a.key = results.first.unique_id if results
        a.itunes_id = @track[:itunes_id]
        a.itunes_collection_id = @track[:itunes_collection_id]
        a.icon = @track[:icon100]
        results.each do |video|
          track_video = Video.create do |v|
            v.key = video.unique_id
            v.title = video.title
            v.duration = video.duration
          end

          a.videos << track_video
        end
       end
      else
        render :json => {:error => "no-results-found"}.to_json, :status => 400 
      end
    end
  end
end
