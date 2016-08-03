# == Schema Information
#
# Table name: followings
#
#  id          :integer          not null, primary key
#  user_id     :integer          not null
#  follower_id :integer          not null
#  created_at  :datetime
#  updated_at  :datetime
#

class Following < ActiveRecord::Base
  belongs_to :user
  belongs_to :follower, :class_name => 'User'
  has_one :notification, class_name: 'FollowingNotification', dependent: :destroy
end
