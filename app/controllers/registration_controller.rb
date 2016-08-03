class RegistrationController < ApplicationController
  before_filter :authenticate
  skip_filter :block_mobile, only: :mobile
  layout 'registration'

  # Index will be hit after the user has initially Facebook auth'd and isn't "registered"
  def index
    # If user hasn't provided a valid email
    # (user.registered should be false if the above is true, but we'll still check explicitly)
    if (current_user.email.nil? || (!current_user.valid? && (current_user.errors.added? :email)))
      redirect_to '/register/add_email'

    # If user is valid but hasn't accepted a username yet
    elsif (current_user.valid? && !current_user.registered)
      redirect_to '/register/choose_username'

    elsif (!current_user.existing_facebook_friends.empty?)
      redirect_to '/register/find_followers'

    # Otherwise back to home we go
    else
      redirect_to '/home'
    end
  end

  def add_email
    # Users marked as registered *should* have valid, non-nil emails, but we'll check explicitly here
    # If they have a valid email set we'll send them away
    unless (current_user.email.nil? || (!current_user.valid? && (current_user.errors.added? :email)))
      # If they haven't registered (chosen a username) we'll send them there now
      if(!current_user.registered)
        redirect_to '/register/choose_username'
      else
        redirect_to '/register/find_followers'
      end
    end
  end

  def update_email
    current_user.email = params[:email].downcase

    # User validation allows nil emails, but not '' so if this validation comes back true
    #  we know the user entered a good email and we can continue
    if (current_user.valid?)
      current_user.save
      redirect_to '/register/choose_username'
    else
      render :action => 'add_email'
    end
  end

  def choose_username
    # Users who have chosen usernames can't change them
    if(current_user.registered)
      redirect_to '/register/find_followers'
    end
  end

  def update_username
    current_user.username = params[:username].downcase

    # TODO: if somehow a user gets to this page but doesn't have an email set, their
    #       username will not be saved and they'll be redirected to enter their email
    if (current_user.valid? && !current_user.email.nil?)
      current_user.registered = true
      current_user.save
      redirect_to '/register/find_followers'
    elsif (current_user.invalid?)
      render :choose_username
    else
      redirect_to '/register'
    end
  end


  def find_followers
    render :find_followers

  end

  def mobile
    render :layout => false
  end

end
