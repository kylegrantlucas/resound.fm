object @post

node :favorited_at do |post|
  favorite = current_user.favorites.where(post_id: post.id).first
  favorite.created_at if favorite
end

extends 'api/posts/base', locals: { follower_ids: current_user.following.map {|f| f.user_id}}