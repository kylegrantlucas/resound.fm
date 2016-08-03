# == Schema Information
#
# Table name: videos
#
#  id         :integer          not null, primary key
#  key        :text
#  title      :text
#  created_at :datetime
#  updated_at :datetime
#  track_id   :integer
#

# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :video do
    key "MyText"
    title "MyText"
  end
end
