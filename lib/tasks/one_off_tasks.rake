namespace :tasks do
  task :convert_case_sensitive_hashtags => :environment do
    Post.all.each do |post|
      post.tags.each do |tag|
        new_tag = Tag.find_or_create_by(text: tag.text.downcase)
        if new_tag.text != tag.text
          post.tags << new_tag
          tag.destroy
        end
      end

      post.save!
    end
  end

  task :associate_all_tracks_with_videos => :environment do
    Track.all.each do |track|
      query = track.name + ' - ' + track.artist
      @yt_client = YouTubeIt::Client.new
      results = @yt_client.videos_by({query: query, format:5, categories: {either: [:music, :entertainment]}, page: 1, per_page: 5}).videos
      results.each do |video|
        track_video = Video.create do |v|
          v.key = video.unique_id
          v.title = video.title
        end

        track.videos << track_video
      end

      track.save!
    end
  end

  task :extract_all_track_colors => :environment do
    Track.all.each do |track|
      track.extractColors
    end
  end

  task :create_secondary_followers => :environment do
    User.last.following.create do |f|
      f.user = User.all.sample
    end

    User.last.following.each do |f|
      10.times do
        f.user.following.create do |f|
          f.user = User.all.sample
        end
      end
    end
  end
end