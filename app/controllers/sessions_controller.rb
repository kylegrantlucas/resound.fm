class SessionsController < ApplicationController
  skip_filter :block_mobile
  
  def create
    user = User.from_omniauth(env['omniauth.auth'])

    session[:user_id] = user.id
    if request.user_agent =~ /Mobile|webOS/
      redirect_to '/register/mobile'
    else
      if (user.registered)
        redirect_to root_url
      else
        redirect_to '/register'
      end
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to home_url
  end
end
