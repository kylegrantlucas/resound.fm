User.observers.disable :all do

  30.times do
    first_name = Faker::Name.first_name
    last_name = Faker::Name.last_name
    username = Faker::Internet.user_name("#{first_name} #{last_name}", %w(.))
    email = Faker::Internet.safe_email("#{first_name}_#{last_name}")
    fb_id = Faker::Internet.user_name("#{first_name} #{last_name}", %w(.))

        User.create(first_name: first_name,
                    last_name: last_name,
                    username: username,
                    email: email,
                    gender: 'male',
                    fb_id: fb_id,
                    fb_token: "thisisafakeuser",
                    fb_token_expiration: Time.now + 30.days,
                    last_login: Time.now)

  end

  json_file = File.read("#{Rails.root}/bin/tracks.json")
  tracks = JSON.parse(json_file)

  tracks.each do |track|
    Track.create(name: track['name'],
                 artist: track['artist'],
                 artist_id: track['artist_id'],
                 album: track['album'],
                 duration: track['duration'],
                 provider: track['provider'],
                 key: track['key'],
                 itunes_id: track['itunes_id'],
                 itunes_collection_id: track['itunes_collection_id'],
                 icon: track['icon'])
  end

  User.all.each do |user|
    7.times do
      post = Post.new(message: "#{Faker::Lorem.paragraph(2)} #{Faker::Lorem.words.map!{ |x| "\##{x}"}.join(" ")}")
      track = Track.all.sample
      post.track = track
      post.user = user

      Twitter::Extractor.extract_hashtags(post.message).each do |hashtag|
        tag = Tag.find_or_create_by(text: hashtag)

        post.tags << tag
      end

      post.save
    end
  end


  User.all.each do |user|
    5.times do
      target_user = User.all.sample
      target_post = target_user.posts.sample

      comment = Comment.new(message: "#{Faker::Lorem.paragraph(1)} #{Faker::Lorem.words.map!{ |x| "\##{x}"}.join(" ")}")
      comment.post = target_post
      comment.user = user
      comment.save
    end

    15.times do
      target_user = User.all.sample
      target_post = target_user.posts.sample

      favorite = Favorite.new()
      favorite.post = target_post
      favorite.user = user
      favorite.save
    end
  end
end
