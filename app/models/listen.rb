# == Schema Information
#
# Table name: listens
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  post_id    :integer
#  created_at :datetime
#  updated_at :datetime
#

class Listen < ActiveRecord::Base
  belongs_to :user
  belongs_to :post, counter_cache: true

end
