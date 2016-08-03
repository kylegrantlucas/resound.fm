class PostNotificationWorker
  include Sidekiq::Worker

  def perform(post_id)
    post = Post.find_by_id(post_id)
    if post
      begin
        tagged_people = BeatstreamText::extract_mentioned_usernames(post.message)

        if tagged_people
          tagged_people.each do |username|
            user = User.find_by_username(username)

            unless user.id == post.user.id
              tag_notification = TagNotification.new

              tag_notification.user = user
              tag_notification.post = post

              tag_notification.save
            end


          end
        end
      rescue
        puts 'Invalid username'
      end
    end
  end
end