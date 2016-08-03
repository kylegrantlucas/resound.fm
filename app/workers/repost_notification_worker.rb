class RepostNotificationWorker
  include Sidekiq::Worker

  def perform(repost_id)
    repost = Post.find_by_id(repost_id)

    if repost
      unless repost.user_id == repost.parent.user_id
        RepostNotification.create do |r|
          r.user = repost.parent.user
          r.post = repost
        end
      end
    end
  end
end
