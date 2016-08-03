# == Schema Information
#
# Table name: notifications
#
#  id              :integer          not null, primary key
#  category        :integer
#  user_id         :integer
#  comment_id      :integer
#  following_id    :integer
#  favorite_id     :integer
#  read_at         :datetime
#  target_url      :text
#  type            :string(255)
#  notification_id :integer
#  created_at      :datetime
#  updated_at      :datetime
#  joiner_id       :integer
#  post_id         :integer
#

# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :notification do
    type 1
  end
end
