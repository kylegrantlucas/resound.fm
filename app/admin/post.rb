ActiveAdmin.register Post do
	config.per_page = 10
  
  # See permitted parameters documentation:
  # https://github.com/gregbell/active_admin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  permit_params :message, :user_id, :track_id, :listens_count, :deleted_at

  
end
