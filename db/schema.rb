# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140828234744) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: true do |t|
    t.string   "namespace"
    t.text     "body"
    t.string   "resource_id",   null: false
    t.string   "resource_type", null: false
    t.integer  "author_id"
    t.string   "author_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "active_admin_comments", ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id", using: :btree
  add_index "active_admin_comments", ["namespace"], name: "index_active_admin_comments_on_namespace", using: :btree
  add_index "active_admin_comments", ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id", using: :btree

  create_table "admin_users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "admin_users", ["email"], name: "index_admin_users_on_email", unique: true, using: :btree
  add_index "admin_users", ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true, using: :btree

  create_table "comments", force: true do |t|
    t.text     "message",    null: false
    t.integer  "user_id"
    t.integer  "post_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "deleted_at"
  end

  add_index "comments", ["post_id", "user_id"], name: "index_comments_on_post_id_and_user_id", using: :btree
  add_index "comments", ["post_id"], name: "index_comments_on_post_id", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "favorites", force: true do |t|
    t.integer  "user_id"
    t.integer  "post_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "favorites", ["post_id"], name: "index_favorites_on_post_id", using: :btree
  add_index "favorites", ["user_id"], name: "index_favorites_on_user_id", using: :btree

  create_table "followings", force: true do |t|
    t.integer  "user_id",     null: false
    t.integer  "follower_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "followings", ["follower_id"], name: "index_followings_on_follower_id", using: :btree
  add_index "followings", ["user_id"], name: "index_followings_on_user_id", using: :btree

  create_table "listens", force: true do |t|
    t.integer  "user_id"
    t.integer  "post_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "listens", ["post_id"], name: "index_listens_on_post_id", using: :btree
  add_index "listens", ["user_id"], name: "index_listens_on_user_id", using: :btree

  create_table "notifications", force: true do |t|
    t.integer  "category"
    t.integer  "user_id"
    t.integer  "comment_id"
    t.integer  "following_id"
    t.integer  "favorite_id"
    t.datetime "read_at"
    t.text     "target_url"
    t.string   "type"
    t.integer  "notification_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "joiner_id"
    t.integer  "post_id"
    t.integer  "highest_spot"
  end

  add_index "notifications", ["comment_id"], name: "index_notifications_on_comment_id", using: :btree
  add_index "notifications", ["favorite_id"], name: "index_notifications_on_favorite_id", using: :btree
  add_index "notifications", ["following_id"], name: "index_notifications_on_following_id", using: :btree
  add_index "notifications", ["id", "type"], name: "index_notifications_on_id_and_type", using: :btree
  add_index "notifications", ["post_id"], name: "index_notifications_on_post_id", using: :btree
  add_index "notifications", ["user_id"], name: "index_notifications_on_user_id", using: :btree

  create_table "post_tags", force: true do |t|
    t.integer  "post_id"
    t.integer  "tag_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "post_tags", ["post_id", "tag_id"], name: "index_post_tags_on_post_id_and_tag_id", using: :btree
  add_index "post_tags", ["post_id"], name: "index_post_tags_on_post_id", using: :btree
  add_index "post_tags", ["tag_id"], name: "index_post_tags_on_tag_id", using: :btree

  create_table "posts", force: true do |t|
    t.text     "message"
    t.integer  "user_id"
    t.integer  "track_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "listens_count",   default: 0, null: false
    t.datetime "deleted_at"
    t.integer  "parent_id"
    t.float    "score"
    t.integer  "comments_count",  default: 0, null: false
    t.integer  "favorites_count", default: 0, null: false
    t.integer  "reposts_count",   default: 0, null: false
  end

  add_index "posts", ["parent_id"], name: "index_posts_on_parent_id", using: :btree
  add_index "posts", ["track_id"], name: "index_posts_on_track_id", using: :btree
  add_index "posts", ["user_id"], name: "index_posts_on_user_id", using: :btree

  create_table "suggested_users", force: true do |t|
    t.datetime "dismissed_at"
    t.integer  "suggested_user_id"
    t.integer  "owner_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "type_flag"
  end

  add_index "suggested_users", ["owner_id"], name: "index_suggested_users_on_owner_id", using: :btree
  add_index "suggested_users", ["suggested_user_id"], name: "index_suggested_users_on_suggested_user_id", using: :btree

  create_table "tags", force: true do |t|
    t.text     "text",                    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "posts_count", default: 0, null: false
  end

  add_index "tags", ["text"], name: "index_tags_on_text", unique: true, using: :btree

  create_table "tracks", force: true do |t|
    t.string   "name",                 null: false
    t.string   "artist",               null: false
    t.string   "artist_id",            null: false
    t.string   "album"
    t.integer  "duration",             null: false
    t.string   "provider",             null: false
    t.string   "key",                  null: false
    t.string   "itunes_id"
    t.string   "itunes_collection_id"
    t.text     "icon",                 null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "color1"
    t.string   "color2"
    t.string   "color3"
    t.string   "color4"
  end

  add_index "tracks", ["itunes_id"], name: "index_tracks_on_itunes_id", unique: true, using: :btree
  add_index "tracks", ["provider", "key"], name: "index_tracks_on_provider_and_key", using: :btree

  create_table "users", force: true do |t|
    t.string   "first_name",                               null: false
    t.string   "last_name",                                null: false
    t.string   "email"
    t.string   "gender"
    t.string   "fb_id",                                    null: false
    t.string   "fb_token",                                 null: false
    t.datetime "fb_token_expiration",                      null: false
    t.datetime "last_login",                               null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "theme_song_id"
    t.string   "username"
    t.boolean  "registered",               default: false
    t.string   "bio"
    t.integer  "feed_page_flash_id",       default: 1
    t.integer  "trending_page_flash_id",   default: 0
    t.integer  "user_page_flash_id",       default: 0
    t.integer  "user_page_bio_callout_id", default: 1
    t.string   "auth_token"
    t.integer  "notifications_count",      default: 0,     null: false
    t.integer  "onboarding_id",            default: 1
    t.integer  "posts_count",              default: 0,     null: false
    t.string   "provider"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["fb_id"], name: "index_users_on_fb_id", unique: true, using: :btree
  add_index "users", ["theme_song_id"], name: "index_users_on_theme_song_id", using: :btree
  add_index "users", ["username"], name: "index_users_on_username", unique: true, using: :btree

  create_table "videos", force: true do |t|
    t.text     "key"
    t.text     "title"
    t.integer  "duration"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "track_id"
    t.integer  "post_id"
  end

  add_index "videos", ["post_id"], name: "index_videos_on_post_id", using: :btree
  add_index "videos", ["track_id"], name: "index_videos_on_track_id", using: :btree

end
