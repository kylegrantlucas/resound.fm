class Api::SuggestedUsersController < Api::ApiController
  def destroy
    s = SuggestedUser.find_by_owner_id_and_suggested_user_id(current_user.id, params[:id])
    s.dismissed_at = Time.now if s
    s.save if s

    if s
     	render json: true 
    else 
    	render json: false
    end 
  end
end