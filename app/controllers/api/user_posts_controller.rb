class Api::UserPostsController < Api::ApiController
  def index
    page = params[:p].to_i || 0
    post_limit = 25
    user = User.find_by_param(params[:user_id])
    @posts = user.posts.limit(post_limit).offset(page * post_limit).order(created_at: :desc).includes({comments: [:user]}, :track, :user, {favorites: [:user]}, :reposts)
  end

  def liked
    page = params[:p].to_i || 0
    post_limit = 25
    user = User.find_by_param(params[:user_id])
    favorites = user.favorites.order(created_at: :desc).limit(post_limit).offset(page * post_limit).map { |f| f.post_id }
    @posts = Post.with_associated.where('id in (?)', favorites).sort_by {|p| favorites.to_a.index(p.id) }
  end
end
