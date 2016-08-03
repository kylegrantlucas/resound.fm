class ExploreController < ApplicationController
  before_filter :authenticate
  before_filter :check_registered

  def index
    @posts = Post.with_associated.limit(25).offset(0).order(created_at: :desc)
    @user = current_user

    render 'feed/index'
  end
end
