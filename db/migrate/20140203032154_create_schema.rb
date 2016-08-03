class CreateSchema < ActiveRecord::Migration
  def change

    create_table :users do |t|
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :email, null: false
      t.string :gender, null: false
      t.string :fb_id, null: false
      t.string :fb_token, null: false
      t.datetime :fb_token_expiration, null: false
      t.datetime :last_login, null: false
      t.timestamps
    end

    add_index :users, :fb_id, :unique => true
    add_index :users, :email, :unique => true

    create_table :followings do |t|
      t.integer :user_id, null: false
      t.integer :follower_id, null: false
      t.timestamps
    end

    create_table :tracks do |t|
      t.string :name, null: false
      t.string :artist, null: false
      t.string :artist_id, null: false
      t.string :album
      t.integer :duration, null: false
      t.string :provider, null: false
      t.string :key, null: false
      t.string :itunes_id
      t.string :itunes_collection_id
      t.text :icon, null: false
      t.timestamps
    end

    add_index :tracks, :itunes_id, :unique => true
    add_index :tracks, [:provider, :key], :unique => true

    create_table :posts do |t|
      t.text :message
      t.belongs_to :user
      t.belongs_to :track
      t.timestamps
    end

    create_table :comments do |t|
      t.text :message, null: false
      t.belongs_to :user
      t.belongs_to :post
      t.timestamps
    end

    create_table :favorites do |t|
      t.belongs_to :user
      t.belongs_to :post
      t.timestamps
    end

    create_table :listens do |t|
      t.belongs_to :user
      t.belongs_to :post
      t.timestamps
    end

    create_table :tags do |t|
      t.text :text, null: false
      t.timestamps
    end

    add_index :tags, :text, :unique => true

    create_table :post_tags do |t|
      t.belongs_to :post
      t.belongs_to :tag
      t.timestamps
    end

  end
end
