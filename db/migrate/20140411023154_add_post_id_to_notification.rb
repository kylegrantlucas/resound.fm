class AddPostIdToNotification < ActiveRecord::Migration
  def change
    add_column :notifications, :post_id, :integer
    add_index :notifications, :post_id
  end
end
