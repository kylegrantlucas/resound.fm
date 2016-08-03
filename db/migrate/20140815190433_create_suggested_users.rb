class CreateSuggestedUsers < ActiveRecord::Migration
  def change
    create_table :suggested_users do |t|
      t.datetime :dismissed_at
      t.integer :suggested_user_id
      t.integer :owner_id
      t.timestamps
    end

    add_index :suggested_users, :suggested_user_id
    add_index :suggested_users, :owner_id
  end
end
