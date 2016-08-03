class Api::CommentsController < Api::ApiController
  def index
    # Fetch all the comments for now. Managing pagination of comments is hard on the frontend. Punting that till later.
    @comments = Post.find(params[:post_id]).comments
  end

  def create
    @post = Post.find(params[:post_id])
    @comment = @post.comments.create do |c|
      c.message = params[:comment][:message]
      c.user = current_user
    end

    unless params[:comment][:message].nil?
      tags = BeatstreamText.extract_hashtags(params[:comment][:message])

      tags.each do |tag|
        @post.tags << Tag.find_or_create_by(text: tag.downcase)
      end
    end

    CommentNotificationWorker.perform_async(@comment.id)
  end

  def destroy
    render json: Comment.find(params[:id]).destroy
  end
end
