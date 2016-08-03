class PostObserver < ActiveRecord::Observer
  observe :post

  def after_create(post)
    post.calculate_score!
  end

  def after_score_calculation(post)
    top_posts = Post.order(score: :desc).limit(10)

    if top_posts.include?(post)
      index = top_posts.index(post) + 1
      if post.trending_notification == nil
        post.trending_notification = TrendingNotification.create do |t|
          t.highest_spot = index
          t.user = post.user
        end
      else
        notif = post.trending_notification
        notif.highest_spot = index if notif.highest_spot < index
        notif.save!
      end

      post.save!
    end

  end
end