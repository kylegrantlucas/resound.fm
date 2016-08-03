require 'spec_helper'
require 'youtube_it'
require 'multi_json'

describe BeatMatch do

  it 'should should pick the right video' do

    youtube_results = []
    itunes_results = []

    Dir.foreach(File.join(File.dirname(__FILE__), '/youtube-responses')) do |f|
      if File.file?(File.join(File.dirname(__FILE__), '/youtube-responses', f))
        youtube_results << Marshal.load(File.read(File.join(File.dirname(__FILE__), '/youtube-responses', f)))
      end
    end

    Dir.foreach(File.join(File.dirname(__FILE__), '/itunes-responses')) do |f|
      if File.file?(File.join(File.dirname(__FILE__), '/itunes-responses', f))
        itunes_results << MultiJson.load(File.read(File.join(File.dirname(__FILE__), '/itunes-responses', f)), :symbolize_keys => true)
      end
    end

    bm = BeatMatch.new

    youtube_results.each_with_index do |r, i|
      track = itunes_results[i]
      scored_videos = bm.beat_match_rank(track, r.videos)

      puts "===================================================="
      puts "##{i} Name: #{track[:name]}"
      puts track[:duration]

      scored_videos.each do |v|
        puts 'Title: ' + v.video.title
        puts v.video.player_url
        puts "Duration: #{v.video.duration}"
        puts "Duration Distance Score: #{v.duration_difference_score}"
        puts "Featured Channel Score: #{v.featured_channel_score}"
        puts "Total Score: #{v.score}"
        puts

      end
    end



  end
end