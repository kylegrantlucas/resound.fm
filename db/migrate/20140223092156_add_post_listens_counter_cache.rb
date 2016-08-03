class AddPostListensCounterCache < ActiveRecord::Migration
  def change
    add_column :posts, :listens_count, :integer, default: 0, null: false
  end
end
