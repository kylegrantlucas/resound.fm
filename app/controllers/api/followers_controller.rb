class Api::FollowersController < Api::ApiController
  def index
    user = User.find_by_param(params[:user_id])
    @followers = Following.where(user_id: user.id).to_a
  end

  def followings
    user = User.find_by_param(params[:id])
    @followings = Following.where(follower_id: user.id).to_a
  end

  def create
    user = User.find_by_param(params[:user_id])
    suggested_user = current_user.suggested_users.where('suggested_user_id = ?', user.id).first
    suggested_user.destroy if suggested_user
    @following = current_user.follow(user.id)


    FollowingNotificationWorker.perform_async(@following.id)
  end

  def destroy
    user = User.find_by_param(params[:user_id])
    @following = current_user.unfollow(user.id)
  end
end
