ActiveAdmin.register User do
	config.per_page = 10
  
  # See permitted parameters documentation:
  # https://github.com/gregbell/active_admin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
   permit_params :first_name, :last_name, :username, :gender, :email

  
end
