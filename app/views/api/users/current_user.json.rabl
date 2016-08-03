object @user
attributes :unread_notification_count, :user_page_flash_id, :feed_page_flash_id, :trending_page_flash_id, :user_page_bio_callout_id, :bio, :onboarding_id

node(:unread_notification_count) { |user| user.notifications.where(read_at: nil).size }

child :following_recommendations do
  extends 'api/users/base', locals: { follower_ids: current_user.following.map {|f| f.user_id}}
end

node(:following) {nil}
extends 'api/users/base', locals: { follower_ids: current_user.following.map {|f| f.user_id}}
