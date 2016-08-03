require 'net/http'
require 'multi_json'

class Rdio

  def initialize(access_token)
    @access_token = access_token
  end

  def get(key)
    objects = api_call('get', {keys:key, extras:'isrcs'})['result']
    objects[key]
  end

  def search(query)
    api_call('search', {query:query, types:'track'})['result']
  end

  protected

  def api_call(method, params)
    uri = URI('https://www.rdio.com/api/1/')
    params ||= {}
    params[:method] = method
    params[:access_token] = @access_token
    body = Net::HTTP.post_form(uri, params).body
    MultiJson.decode(body)
  end

end