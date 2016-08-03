class Api::TrackSearchController < ApplicationController
  def index
    search = SongSearch.new(ENV['SOUNDCLOUD_ID'])

    @tracks = search.search_realtime(params[:query])
    render json: @tracks
  end
end
