require 'youtube_it'
require 'itunes-search-api'
require 'song_utils'

class BeatMatch

  def initialize
    @yt_client = YouTubeIt::Client.new
  end

  def find_video_for_itunes_track(itunes_track_id)
    itunes_results = ITunesSearchAPI.lookup(id: itunes_track_id)
    processed_track = SongUtils.process_itunes_song(itunes_results)
    find_video_for_track(processed_track)
  end


  # Finds the most accurately matched video via youtube for a given track
  # Track must be a hash with the following parameters
  #
  # @param track [Hash] a track object with the parameters :title, :artist, and :duration
  def find_video_for_track(track)
    query = track[:name] + ' - ' + track[:artist]
    results = @yt_client.videos_by({query: query, video_format: 5, categories: {either: [:music, :entertainment]}})
    results = beat_match_rank(track, results.videos)
    results[0]
  end

  def beat_match_rank(itunes_track, videos)
    scored_videos = []

    if videos
      videos.each do |v|
        scored_videos << ScoredVideo.new(itunes_track, v)
      end
    end

    scored_videos.sort!

    score_bound = scored_videos.first.score - 2

    scored_videos.keep_if {|v| v.score >= score_bound}

    scored_videos.sort! {|x,y| y.video.view_count <=> x.video.view_count}
  end

end