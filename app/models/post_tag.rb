# == Schema Information
#
# Table name: post_tags
#
#  id         :integer          not null, primary key
#  post_id    :integer
#  tag_id     :integer
#  created_at :datetime
#  updated_at :datetime
#

class PostTag < ActiveRecord::Base
  belongs_to :post
  belongs_to :tag, counter_cache: :posts_count
end
