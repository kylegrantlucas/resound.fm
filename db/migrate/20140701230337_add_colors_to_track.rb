class AddColorsToTrack < ActiveRecord::Migration
  def change
    add_column :tracks, :color1, :string
    add_column :tracks, :color2, :string
    add_column :tracks, :color3, :string
    add_column :tracks, :color4, :string
  end
end
