class AddPostThemeSong < ActiveRecord::Migration
  def change
    add_column :users, :theme_song_id, :integer
  end
end
