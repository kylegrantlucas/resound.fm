class Api::PostsController < Api::ApiController
  def index
    page = params[:p].to_i || 0
    post_limit = 25
    @posts = Post.with_associated.limit(post_limit).offset(page * post_limit).order(created_at: :desc)
  end

  def feed
    page = params[:p].to_i || 0
    post_limit = 25
    @user = User.find(current_user.id)
    @posts = Post.with_associated.where('user_id IN (?)', @user.following.to_a.map!{ |f| f.user_id  }.push(@user.id)).limit(post_limit).offset(page * post_limit).order(created_at: :desc)
  end

  def trending
    page = params[:p].to_i || 0
    post_limit = 25
    @posts = Post.trending_with_associated.limit(post_limit).offset(page * post_limit).order(score: :desc)
  end

  def show
    @post = Post.find(params[:id])
  end


  def create
    @post = current_user.create_post(post_params)

    PostNotificationWorker.perform_async(@post.id)
  end

  def destroy
    @post = Post.find(params[:id])

    @post.destroy
  end

  def make_theme_song
    @post = Post.find(params[:id])

    current_user.theme_song = @post
    render json: current_user.save
  end

  def repost
      post = Post.find(params[:id])

      @repost = Post.new
      @repost.track = post.track
      @repost.user = current_user
      @repost.message = params[:message]
      @repost.parent = post

      post_tags = []

      unless params[:message].nil?
        tags = BeatstreamText.extract_hashtags(params[:message])

        tags.each do |tag|
          post_tags << Tag.find_or_create_by(text: tag)
        end
      end

      @repost.tags = post_tags

      @repost.save

      PostNotificationWorker.perform_async(@repost.id)
      RepostNotificationWorker.perform_async(@repost.id)
      post.calculate_score!
  end

  private

  def post_params
    params.permit(:message, :video_id, track: [:id, :key, :provider])
  end
end
