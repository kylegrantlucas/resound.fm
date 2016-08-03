class Api::ApiController < ApplicationController
  respond_to :json
  before_action :authenticate
  skip_before_action :verify_authenticity_token


  protected
  def authenticate
    authenticate_or_request_with_http_token do |token, options|
      User.find_by(auth_token: token)
    end
  end
end
