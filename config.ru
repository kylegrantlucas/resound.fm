# This file is used by Rack-based servers to start the application.
#
require 'gctools/oobgc'

if ENV['RAILS_ENV'] == 'production'
  require 'unicorn/worker_killer'

  oom_min = (155) * (1024**2)
  oom_max = (500) * (1024**2)

  # Max memory size (RSS) per worker
  use Unicorn::WorkerKiller::Oom, oom_min, oom_max
end

if ['RAILS_ENV'] == 'staging'
  require 'unicorn/worker_killer'

  oom_min = (155) * (1024**2)
  oom_max = (170) * (1024**2)

  # Max memory size (RSS) per worker
  use Unicorn::WorkerKiller::Oom, oom_min, oom_max
end


require ::File.expand_path('../config/environment',  __FILE__)
run Rails.application

if defined?(Unicorn::HttpRequest)
  use GC::OOB::UnicornMiddleware
end
