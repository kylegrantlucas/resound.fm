object @user
attributes :id, :username, :first_name, :last_name, :bio

node (:icon) { |user| user.fb_icon }
node (:icon200) { |user| user.fb_icon200 }

if locals[:follower_ids]
  node(:following) { |user| locals[:follower_ids].include?(user.id)}
else
  node(:following) { |user| current_user.following.map {|f| f.user_id}.include?(user.id) }
end