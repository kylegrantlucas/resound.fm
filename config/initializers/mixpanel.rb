BeatstreamRails::Application.configure do
  config.middleware.use "Mixpanel::Middleware", ENV['MIXPANEL_API_TOKEN'], {insert_js_last: false, persist: true}
end