class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.integer :category
      t.integer	:user_id
      t.integer :comment_id
      t.integer :following_id
      t.integer :favorite_id
      t.datetime	:read_at
      t.text	:target_url
      t.string :type
      t.integer :notification_id

      t.timestamps
    end
  end
end
