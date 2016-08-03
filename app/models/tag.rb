# == Schema Information
#
# Table name: tags
#
#  id         :integer          not null, primary key
#  text       :text             not null
#  created_at :datetime
#  updated_at :datetime
#

class Tag < ActiveRecord::Base
  has_many :post_tags
  has_many :posts, through: :post_tags

  include PgSearch
  pg_search_scope :search_by_text, :against => [:text], :using => { :tsearch => {:prefix => true} }

  TAG_ROUTE_REGEX = /\w[\w\.]*\w/i

  def self.trending_tags
    Tag.joins(:post_tags).where('post_tags.created_at > ? AND NOT tags.text=\'noplay\'', 30.days.ago).group('tags.id')
       .select('tags.*, COUNT(*) AS post_count').order('post_count DESC').limit(20)
  end
end
