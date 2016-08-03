class SuggestedUser < ActiveRecord::Base
  belongs_to :suggested_user, :class_name => "User"
  belongs_to :owner, :class_name => "User"
end
