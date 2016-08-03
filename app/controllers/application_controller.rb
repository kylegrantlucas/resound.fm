class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.


  protect_from_forgery with: :exception
  rescue_from ActiveRecord::RecordNotFound, :with => :render_404

  before_filter :set_cache_buster
  before_filter :block_mobile

  module CurrentUserHelper
    def current_user
      @current_user ||= User.find(session[:user_id]) if session[:user_id]
    end
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]

    # unless @current_user
    #   user = User.find_by_id(params[:user_id])
    #   @current_user = user if user && request.headers['HTTP_AUTHORIZATION'] && user.auth_token == request.headers['HTTP_AUTHORIZATION'].sub("Token token=", '')
    # end
  end

  def following_recommendations
      current_user.suggested_users.where('dismissed_at IS null').map { |s| s.suggested_user }
  end

  helper_method :current_user
  helper_method :following_recommendations

  private

  def authenticate
    redirect_to :home unless current_user
  end

  def check_registered
    redirect_to '/register' unless current_user.registered
  end



  def trending_tags
    @trending_tags ||= Tag.trending_tags
  end

  def set_cache_buster
    response.headers["Cache-Control"] = "no-cache, no-store, max-age=0, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "Fri, 01 Jan 1990 00:00:00 GMT"
  end

  def block_mobile
    if request.user_agent =~ /Mobile|webOS/
      redirect_to '/register/mobile'
    end
  end

  def render_404
    redirect_to '/' and return
  end


  helper_method :trending_tags
end
