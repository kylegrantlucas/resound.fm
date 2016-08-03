class ListenObserver < ActiveRecord::Observer
  observe :listen

  def after_create(listen)
    listen.post.calculate_score!

    if listen.post.listens.size > 10
      if listen.post.play_count_notification == nil
        # PlayCountNotification.create do |p|
        #   p.user = listen.post.user
        #   p.post = listen.post
        # end
      end
    end
  end
end
