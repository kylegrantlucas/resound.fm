class TagsController < ApplicationController
  before_filter :authenticate
  before_filter :check_registered

  def show
    @posts = Post.joins(post_tags: :tag).where('tags.text = ?', params[:tag].downcase).order('posts.created_at desc').limit(25).includes({comments: [:user]}, :track, :user, {favorites: [:user]}).distinct

    render 'feed/index'
  end

end
