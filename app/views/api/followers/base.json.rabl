object @following
attributes :created_at

node(:id) { |following| following.follower.id }