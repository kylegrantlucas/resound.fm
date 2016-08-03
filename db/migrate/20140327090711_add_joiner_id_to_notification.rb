class AddJoinerIdToNotification < ActiveRecord::Migration
  def change
    add_column :notifications, :joiner_id, :integer
  end
end
