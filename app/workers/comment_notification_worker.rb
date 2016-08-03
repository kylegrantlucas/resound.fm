class CommentNotificationWorker
  include Sidekiq::Worker

  def perform(comment_id)
    comment = Comment.find_by_id(comment_id)

    if comment
      tagged_people = []
      tagged_usernames = BeatstreamText::extract_mentioned_usernames(comment.message)

      begin
        if tagged_usernames
          tagged_people = tagged_usernames.map { |x| User.find_by_username(x) }.compact

          tagged_people.each do |user|
            unless user.id == comment.user.id
              TagNotification.create do |t|
                t.user = user
                t.comment = comment
              end

             # Pusher["private-#{user.id}"].trigger('new_notification', {:icon => tag_notification.icon, :url => tag_notification.target_url, :text => tag_notification.decorate.text, :id => tag_notification.id, :created_at => tag_notification.created_at})
            end


          end
        end
      rescue
        puts 'User tagged invalid user'
      end

      unless comment.user.id == comment.post.user.id
        users = []
        users << comment.post.user
        users += comment.post.comments.map { |x| x.user unless comment.user_id == x.user_id }.compact.uniq
        users -= tagged_people

        users.uniq.each do |user|
          CommentNotification.create do |n|
            n.user = user
            n.comment = comment
          end

          # Pusher["private-#{user.id}"].trigger('new_notification', {:icon => notification.icon, :url => notification.target_url, :text => notification.decorate.text, :id => notification.id, :created_at => notification.created_at})
        end
      end
    end
  end
end