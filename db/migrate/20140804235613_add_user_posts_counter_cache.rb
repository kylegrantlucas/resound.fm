class AddUserPostsCounterCache < ActiveRecord::Migration
  def change
    add_column :users, :posts_count, :integer, default: 0, null: false

    User.reset_column_information
    User.all.each do |u|
      User.update_counters u.id, :posts_count => u.posts.length
    end
  end
end
