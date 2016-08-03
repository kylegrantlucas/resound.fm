class Api::UsersController < Api::ApiController
  def show
    @user = User.find_by_param(params[:id])
  end

  def following_recommendations
    @users = current_user.suggested_users.where('dismissed_at IS null').map { |s| s.suggested_user }
  end

  def update
    @user = current_user
    @user.skip_email = true
    @user.onboarding_id = 0 if params[:onboarding_id]
    @user.bio = params[:bio] if params[:bio]
    @user.user_page_bio_callout_id = 0 if params[:user_page_bio_callout_id]
    @user.save
  end

end
