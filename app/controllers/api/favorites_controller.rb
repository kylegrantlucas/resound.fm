class Api::FavoritesController < Api::ApiController
  def show
    @post = Post.find(params[:post_id])
  end

  def create
    @post = Post.find(params[:post_id])
    if @post.favorites.where(user_id: current_user.id).empty?
      @favorite = @post.favorites.create do |f|
        f.user = current_user
      end
    end

    FavoriteNotificationWorker.perform_async(@favorite.id)
  end

  def destroy
    @favorite = Favorite.find_by({user: current_user, post_id: params[:post_id]})

    render json: @favorite.destroy
  end
end
