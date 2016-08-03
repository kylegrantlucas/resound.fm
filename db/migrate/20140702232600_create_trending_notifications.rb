class CreateTrendingNotifications < ActiveRecord::Migration
  def change
    add_column :notifications, :highest_spot, :integer
  end
end
