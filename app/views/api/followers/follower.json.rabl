object @following
glue :follower do
  node(:bio)  { |user| user.bio }
  extends 'api/users/base'
end
