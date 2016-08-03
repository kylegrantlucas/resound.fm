class Api::ListensController < Api::ApiController
  def create
    # Throttle a user's listens so that they can only listen to one post every 10 seconds.
    @post = Post.find(params[:post_id])
    @last_listen = current_user.listens.last

    if @post && (@last_listen.nil? || @last_listen.created_at < 10.seconds.ago)
      @listen = @post.listens.create({user: current_user})
    else
      @listen = nil
    end

    render json: @listen
  end
end
