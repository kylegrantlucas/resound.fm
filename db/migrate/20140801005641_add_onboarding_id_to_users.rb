class AddOnboardingIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :onboarding_id, :integer, default: 1
  end
end
