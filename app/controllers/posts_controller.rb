class PostsController < ApplicationController

  def show
    @posts = [Post.find(params[:id])]

    render 'feed/index'
  end

end
