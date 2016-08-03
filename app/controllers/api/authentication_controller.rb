class Api::AuthenticationController < Api::ApiController
  skip_before_filter :authenticate, :only => :index

  def index
    user = User.find_by_fb_token(params[:fb_token])

    @token = user ? user.auth_token : nil
  end
end