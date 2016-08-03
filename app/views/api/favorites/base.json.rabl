object @favorite
attributes :id

child :user do
  extends "api/users/base", locals: { follower_ids: locals[:follower_ids] }
end