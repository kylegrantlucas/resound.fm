object @following
glue :user do
  node(:bio)  { |user| user.bio }
  extends 'api/users/base'
end

