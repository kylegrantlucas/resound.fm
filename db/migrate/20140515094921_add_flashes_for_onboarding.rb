class AddFlashesForOnboarding < ActiveRecord::Migration
  def change
    add_column :users, :feed_page_flash_id, :integer, default: 1
    add_column :users, :trending_page_flash_id, :integer, default: 0
    add_column :users, :user_page_flash_id, :integer, default: 0
    add_column :users, :user_page_bio_callout_id, :integer, default: 1
  end
end
