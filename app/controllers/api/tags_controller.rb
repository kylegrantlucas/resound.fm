class Api::TagsController < Api::ApiController
  def show
    page = params[:p].to_i || 0
    post_limit = 25
    @posts = Post.joins(post_tags: :tag).where('tags.text = ?', params[:id].downcase).order('posts.created_at desc').limit(post_limit).offset(page * post_limit).includes({comments: [:user]}, :track, :user, {favorites: [:user]}, :listens).distinct
  end

  def trending
    @tags = Tag.trending_tags
  end
end
