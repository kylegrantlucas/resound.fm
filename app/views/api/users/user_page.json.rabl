object @user
attributes :bio, :user_page_flash_id, :feed_page_flash_id, :trending_page_flash_id, :user_page_bio_callout_id

node(:posts_count) { |user| user.posts.size }
node(:likes_count) { |user| user.favorites.size }
node(:followers_count) { |user| user.followers.size }
node(:following_count) { |user| user.following.size }

child :theme_song do
  extends 'api/tracks/base'
end

extends 'api/users/base'