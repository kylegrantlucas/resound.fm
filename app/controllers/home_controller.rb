class HomeController < ApplicationController

  layout 'home'
  skip_filter :block_mobile
  skip_before_action :verify_authenticity_token


  def index
  end

  def about
  end

  def legal
  end

end
