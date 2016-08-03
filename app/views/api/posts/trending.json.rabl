collection @posts
extends "api/posts/base", locals: { follower_ids: current_user.following.map {|f| f.user_id}}
