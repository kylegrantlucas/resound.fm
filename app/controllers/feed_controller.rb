class FeedController < ApplicationController

  before_filter :authenticate
  before_filter :check_registered
  skip_before_action :verify_authenticity_token


  def index
    @posts = Post.with_associated.where('user_id IN (?)', current_user.following.to_a.map!{ |f| f.user_id  }.push(current_user.id)).limit(25).offset(0).order(created_at: :desc)
    
    if params[:onboarding] && @posts.empty?
      redirect_to '/trending'
    end    
  end

end
