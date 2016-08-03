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

require 'spec_helper'

describe Notification do
  pending "add some examples to (or delete) #{__FILE__}"
end
