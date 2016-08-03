class ComponentsController < ApplicationController

  layout 'components'

  def show
    render params[:id]
  end

end