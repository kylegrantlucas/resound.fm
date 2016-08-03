class UsersController < ApplicationController

  before_filter :authenticate
  before_filter :check_registered

  def show
    @user_page = User.find_by_param(params[:id])
    @posts = @user_page.posts.limit(25).order(created_at: :desc).includes({comments: [:user]}, :track, :user, {favorites: [:user]})

    render 'feed/index'
  end

  def liked
    @user_page = User.find_by_param(params[:id])
    @posts = Post.liked_by_user(@user_page.id).limit(25)

    render 'feed/index'
  end

  def followers
    @user_page = User.find_by_param(params[:id])
    @followers = @user_page.followers
    render 'feed/index'
  end

  def followings
    @user_page = User.find_by_param(params[:id])
    @followings = @user_page.following

    render 'feed/index'
  end
end
