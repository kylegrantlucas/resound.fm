class AddCounterCaches < ActiveRecord::Migration
  def change
    add_column :posts, :comments_count, :integer, default: 0, null: false
    add_column :posts, :favorites_count, :integer, default: 0, null: false
    add_column :tags, :posts_count, :integer, default: 0, null: false
    add_column :posts, :reposts_count, :integer, default: 0, null: false
    add_column :users, :notifications_count, :integer, default: 0, null: false

    Post.reset_column_information
    Post.all.each do |p|
      Post.update_counters p.id, :comments_count => p.comments.length
      Post.update_counters p.id, :favorites_count => p.favorites.length
      Post.update_counters p.id, :reposts_count => p.reposts.length
    end

    Tag.reset_column_information
    Tag.all.each do |t|
      Tag.update_counters t.id, :posts_count => t.posts.length
    end


    User.reset_column_information
    User.all.each do |u|
      User.update_counters u.id, :notifications_count => u.notifications.length
    end
  end
end
