require 'youtube_it'
require 'itunes-search-api'
require 'multi_json'
require './lib/song_utils'

@yt_client = YouTubeIt::Client.new

itunes_ids = [
    '683637613',
    '785638476',
    '515365607',
    '601136935'
]

itunes_ids.each do |i|
  itunes_result = ITunesSearchAPI.lookup(id: i)
  itunes_result = SongUtils.process_itunes_song(itunes_result)

  query = itunes_result[:name] + ' - ' + itunes_result[:artist]

  File.open(File.join(File.dirname(__FILE__),"/itunes-responses/#{query.delete(' ')}.json"), 'w') {|f| f.write(MultiJson.dump(itunes_result)) }

  results = @yt_client.videos_by({query: query, format:5, categories: {either: [:music, :entertainment]}})
  puts results.videos
  File.open(File.join(File.dirname(__FILE__),"/youtube-responses/#{query.delete(' ')}.marshal"), 'w') {|f| f.write(Marshal.dump(results)) }
end

