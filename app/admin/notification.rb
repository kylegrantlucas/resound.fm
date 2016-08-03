ActiveAdmin.register Notification do
	config.per_page = 10
  
  # See permitted parameters documentation:
  # https://github.com/gregbell/active_admin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  permit_params :category, :type, :comment_id, :following_id, :favorite_id, :read_at, :target_url, :notification_id, :created_at, :joiner_id

  
end
