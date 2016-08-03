object @notification
attributes :id, :created_at

node(:icon) { |notification| notification.icon rescue nil }
node(:text) { |notification| notification.decorate.text rescue "Sorry, this notification seems to be broken." }
node(:target_url) { |notification| notification.target_url rescue '/feed' }
node(:read) { |notification| notification.read_at ? true : false }