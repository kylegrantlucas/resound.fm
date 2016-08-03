# == Schema Information
#
# Table name: comments
#
#  id         :integer          not null, primary key
#  message    :text             not null
#  user_id    :integer
#  post_id    :integer
#  created_at :datetime
#  updated_at :datetime
#  deleted_at :datetime
#

class Comment < ActiveRecord::Base

  paranoid

  belongs_to :user
  belongs_to :post, counter_cache: true
  has_one :notification, class_name: 'CommentNotification', dependent: :destroy
  has_many :tag_notifications, class_name: 'TagNotification', dependent: :destroy

end
