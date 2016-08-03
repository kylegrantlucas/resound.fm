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

class Video < ActiveRecord::Base
  belongs_to :track

  def high_quality_thumbnail
    "http://i.ytimg.com/vi/#{self.key}/hqdefault.jpg"
  end

  def medium_quality_thumbnail
    "http://i.ytimg.com/vi/#{self.key}/mqdefault.jpg"
  end

  def thumbnail
    "http://i.ytimg.com/vi/#{self.key}/default.jpg"
  end
end
