object @comment
attributes :id, :message, :created_at

child :user do
  extends "api/users/base", locals: { follower_ids: locals[:follower_ids] }
end