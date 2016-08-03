BeatstreamRails::Application.routes.draw do
  require 'sidekiq/web'
  require 'sidetiq/web'
  require 'admin_constraint'
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  root 'feed#index'
  mount Sidekiq::Web => '/sidekiq', :constraints => AdminConstraint.new
  get '/feed', to: 'feed#index'
  get '/explore', to: 'explore#index'
  get '/trending', to: 'trending#index'

  get '/home', to: 'home#index'
  get '/about', to: 'home#about'
  get '/legal', to: 'home#legal'

  get '/login', to: redirect('/auth/facebook')
  get '/logout', to: 'sessions#destroy'
  get '/auth/:provider/callback', to: 'sessions#create'
  get '/register', to: 'registration#index'
  get '/register/add_email', to: 'registration#add_email'
  post '/register/add_email', to: 'registration#update_email'
  get '/register/choose_username', to: 'registration#choose_username'
  post '/register/choose_username', to: 'registration#update_username'
  get '/register/find_followers', to: 'registration#find_followers'
  get '/register/mobile', to: 'registration#mobile'

  get '/liked', to: 'liked#index'

  get '/users/:id', to: 'users#show', id: User::USERNAME_ROUTE_REGEX
  get '/users/:id/liked', to: 'users#liked', id: User::USERNAME_ROUTE_REGEX
  get '/users/:id/followers', to: 'users#followers', id: User::USERNAME_ROUTE_REGEX
  get '/users/:id/following', to: 'users#followings', id: User::USERNAME_ROUTE_REGEX

  get '/tags/:tag', to: 'tags#show'

  get '/posts/:id', to: 'posts#show'

  get '/notifications', to: 'feed#index'

  get '/whotofollow', to: 'feed#index'

  namespace :api do
    resources :users, id: User::USERNAME_ROUTE_REGEX,  defaults: { :format => 'json' } do

      member do
        get 'followings', to: 'followers#followings'
      end

      resources :user_posts, path: 'posts' do
        collection do
          get 'liked'
        end
      end

      resources :notifications do
        collection do
          post 'read'
        end
      end

      resources :followers do
        delete :index, on: :collection, action: :destroy
      end

      resources :suggested_users
    end

    resources :posts,  defaults: { format: 'json' } do
      get 'feed', on: :collection, action: :feed
      get 'trending', on: :collection, action: :trending

      post 'theme', on: :member, action: :make_theme_song

      post 'repost', on: :member, action: :repost

      resources :comments

      resources :favorites,  defaults: { format: 'json' } do
        delete :index, on: :collection, action: :destroy
      end

      resources :listens,  defaults: { format: 'json' }
    end

    resources :search,  defaults: { format: 'json' }
    resources :tags, id: Tag::TAG_ROUTE_REGEX,  defaults: { format: 'json' }
    resources :match,  defaults: { format: 'json' }
    resources :soundcloud,  defaults: { format: 'json' }
    resources :authentication, defaults: { format: 'json' }

    get 'tracks', to: 'track_search#index',  defaults: { format: 'json' }
    get 'trending_tags', to: 'tags#trending',  defaults: { format: 'json' }
    get 'following_recommendations', to: 'users#following_recommendations',  defaults: { format: 'json' }
  end

  post 'pusher/auth'

  %w( 404 422 500 505 ).each do |code|
    get code, :to => "errors#show", :code => code
  end


  #unless Rails.application.config.consider_all_requests_local
  # match '*not_found', to: 'errors#error_404'
  #end

  resources :components
end
