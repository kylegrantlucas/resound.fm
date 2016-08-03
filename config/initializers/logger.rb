if Rails.env == 'production'
   Rails.logger = Logger.new('/var/www/beatstream/log/beatstream.log')
end