class TrendingController < ApplicationController
  before_filter :authenticate
  before_filter :check_registered

  def index
    page = params[:p] || 0
    post_limit = 25
    @posts = Post.with_associated.limit(post_limit).offset(page * post_limit).order(score: :desc)

    render 'feed/index'
  end
end
