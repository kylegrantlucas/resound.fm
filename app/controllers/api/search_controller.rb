class Api::SearchController < Api::ApiController
  def index
    @results = []
    @tags = []
    @users = []

    if params[:query]
      case params[:query][0]
      when '#'
        @tags = Tag.search_by_text(params[:query])
      when '@'
        @users = User.search_by_full_name(params[:query])
      else
        @tags = Tag.search_by_text(params[:query])
        @users = User.search_by_full_name(params[:query])
      end

      @users.each do |u|
        @results << {
            first_name: u.first_name,
            last_name: u.last_name,
            username: u.username,
            icon: u.icon,
            type: :user,
            url: "/users/#{u.username}"
        }
      end

      @tags.each do |t|
        @results << {
            text: t.text,
            type: :tag,
            url: "/tags/#{t.text}"
        }
      end
    end

    render json: @results
  end
end
