class Api::NotificationsController < Api::ApiController
  def index
    @notifications = []
    page = params[:p].to_i || 0

    if params[:limit].to_i < 25 && params[:limit].to_i != 0
      notifications_limit = params[:limit].to_i
    else
      notifications_limit = 25
    end

    @notifications = Notification.with_associated.where(user_id: current_user.id).order(created_at: :desc).limit(notifications_limit).offset(page * notifications_limit)
  end

  def read
    user = User.find(params[:user_id])

    user.notifications.each do |notification|
      notification.read_at = Time.now unless notification.read_at
      notification.save
    end

    user.save

    render json: true
  end
end
