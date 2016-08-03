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

class Notification < ActiveRecord::Base
	belongs_to :user, counter_cache: true

	CATEGORIES = {1 => 'FAVORITE',  2 => 'FOLLOW', 3 => 'COMMENT', 4 => 'TAG', 5 => 'JOIN'}

  scope :with_associated, lambda { includes(:user) }

	def category_label
		CATEGORIES[self.category]
	end

	def read?
		!self.read_at ? true : false
  end

  def mark_as_read
		self.read_at = Time.now unless read?
	end
end
