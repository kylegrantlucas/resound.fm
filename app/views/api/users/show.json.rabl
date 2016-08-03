object @user
extends 'api/users/user_page', locals: { follower_ids: current_user.following.map {|f| f.user_id}}