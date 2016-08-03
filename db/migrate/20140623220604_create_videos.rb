class CreateVideos < ActiveRecord::Migration
  def change
    create_table :videos do |t|
      t.text :key
      t.text :title
      t.integer :duration

      t.timestamps
    end

    add_column :videos, :track_id, :integer
    add_index :videos, :track_id
    add_column :videos, :post_id, :integer
    add_index :videos, :post_id
  end
end
