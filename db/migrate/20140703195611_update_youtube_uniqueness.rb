class UpdateYoutubeUniqueness < ActiveRecord::Migration
  def change
    remove_index :tracks, [:provider, :key]
    add_index :tracks, [:provider, :key]
  end
end
