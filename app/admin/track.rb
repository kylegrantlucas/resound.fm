ActiveAdmin.register Track do
	config.per_page = 10
  
  # See permitted parameters documentation:
  # https://github.com/gregbell/active_admin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  permit_params :name, :artist, :artist_id, :album, :duration, :provider, :key, :itunes_id, :itunes_collection_id, :icon


end
