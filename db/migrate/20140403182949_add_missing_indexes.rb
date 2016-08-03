class AddMissingIndexes < ActiveRecord::Migration
      def change
        add_index :notifications, :user_id
        add_index :notifications, [:id, :type]
        add_index :notifications, :comment_id
        add_index :notifications, :favorite_id
        add_index :notifications, :following_id
        add_index :comments, :user_id
        add_index :comments, :post_id
        add_index :comments, [:post_id, :user_id]
        add_index :posts, :user_id
        add_index :posts, :track_id
        add_index :users, :theme_song_id
        add_index :post_tags, :post_id
        add_index :post_tags, :tag_id
        add_index :post_tags, [:post_id, :tag_id]
        add_index :favorites, :user_id
        add_index :favorites, :post_id
        add_index :followings, :user_id
        add_index :followings, :follower_id
        add_index :listens, :user_id
        add_index :listens, :post_id
      end
    end
