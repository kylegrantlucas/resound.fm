object @post
attributes :id, :message, :created_at

node(:likes_count) { |post| post.favorites_count }
node(:reposts_count) { |post| post.reposts.count }
node(:comments_count) { |post| post.comments_count }
node(:listens_count) { |post| post.listens_count }

node(:favorited) do |post|
  current_user ? post.favorites.map{ |f| f.user_id}.include?(current_user.id) : false
end

child :track do
  if locals[:object].video
    node(:key) {locals[:object].video.key}
    node(:duration) {locals[:object].video.duration}
  end

  extends 'api/tracks/base'
end

child :user do |user|
  extends 'api/users/base', locals: { follower_ids: locals[:follower_ids] }
end

child :comments, :object_root => nil do
  extends 'api/comments/base', locals: { follower_ids: locals[:follower_ids] }
end

child :favorites do
  extends 'api/favorites/base', locals: { follower_ids: locals[:follower_ids] }
end

child :reposts => :reposts do
  extends 'api/posts/base', locals: { follower_ids: locals[:follower_ids] }
end

child :parent => "parent" do
  attribute :id
  child :user do
    extends 'api/users/base', locals: { follower_ids: locals[:follower_ids] }
  end
end

node(:reposted_by_current_user) { |post| post.reposts.map { |r| r.user_id }.include?(current_user.id) ? true : false}