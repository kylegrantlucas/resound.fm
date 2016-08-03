class LikedController < ApplicationController

  before_filter :authenticate
  before_filter :check_registered

  def index
    @posts = Post.liked_by_user(current_user.id).limit(25)

    render 'feed/index'
  end

end
