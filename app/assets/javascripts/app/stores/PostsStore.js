var API = require('app/lib/API');
var StoreHelpers = require('app/stores/StoreHelpers');
var UserHelpers = require('app/helpers/UserHelpers');

module.exports = Fluxxor.createStore({
  initialize: function(bootstrap) {
    this.posts = _.cloneDeep(bootstrap.posts);

    this.fetchingPosts = false;
    this.postsPageNum = 0;
    this.hasMorePosts = this.posts.length === 25;

    this.loadingNewPage = false;

    this.tempCommentId = -1;
  },

  actions: {
    'POST_DELETE': 'onDeletePost',

    'POSTS_FETCH': 'onFetchPosts',
    'POST_FETCH': 'onFetchPost',
    'PLAYER_ERROR': 'onError',

    'POSTS_ADD': 'onPostsAdd',
    'NEW_POST_SAVE_SUCCESS': 'onNewPostSaveSuccess',

    'USER_FOLLOW': 'onToggleFollow',
    'USER_UNFOLLOW': 'onToggleFollow',
    
    'FAVORITE_POST': 'onToggleFavorite',
    'UNFAVORITE_POST': 'onToggleFavorite',

    'COMMENT_CREATE': 'onCreateComment',
    'COMMENT_CREATE_SUCCESS': 'onCreateCommentSuccess',
    'COMMENT_DELETE': 'onDeleteComment',
    'COMMENTS_FETCH': 'onFetchComments',

    'POST_EXPAND_COMMENTS': 'onExpandComments',

    'COMMENTS_FETCH': 'onFetchComments',

    'LISTEN_POST': 'onAddListen',

    'NAVIGATE': 'onNavigate',

    'PLAYER_GO_TO_POST': 'onGoToPost',
    'PLAYER_GO_TO_POST_SUCCESS': 'onGoToPostSuccess'
  },

  pages: StoreHelpers.Pages,

  onDeletePost: function (payload) {
    this.waitFor(['CurPage'], function (curPage){
      
      var post = this.getPost(payload.postId);

      if (post) {
        ga('send', 'event', 'Post', 'Deleted');  
      }

      this.posts = _.reject(this.posts, {id: payload.postId});

      API.del('/api/posts/' + payload.postId, function (err) {
          if (err) {
            console.error(err);
          }
        });

      this.emit('change');
    });
  },

  fetchPostsThen: function (context, pageNum, cb, force) {
    if ((!this.fetchingPosts && this.hasMorePosts) || force) {
      this.fetchingPosts = true;

      if (force) {
        this.postsPageNum = 0;
        this.hasMorePosts = true;
      }

      
      API.get(this.pages[context.page].url(context.pageOpts), {p: pageNum}, function (err, res) {
          if (err) {
            console.error(err);
          } else {
            this.hasMorePosts = res && res.length === 25;

            res = res || [];
            this.fetchingPosts = false;
            cb.call(this, res, context);
          }
        }.bind(this));
    }
  },

  fetchPostThen: function (context, cb) {
    API.get(this.pages.post.url(context.pageOpts), function (err, res) {
        if (err) {
          console.error(err);
        } else {
          cb.call(this, res, context);
        }
      }.bind(this));
  },

  onNavigate: function (payload) {
    this.waitFor(['CurPage'], function (curPageStore) {
      var curPageContext = curPageStore.getState();

      switch (curPageStore.type) {
        case 'posts':
          this.loadingNewPage = true;
          this.fetchPostsThen(curPageContext, 0, function (posts, context) {
            if (_.isEqual(curPageContext, context)) {
              this.posts = posts;
              this.posts = _.sortBy(this.posts, this.pages[context.page].comparator);
              this.loadingNewPage = false;
              this.emit('change');  
            }
          }, true);
          this.emit('change');
          break;
        case 'post':
          this.loadingNewPage = true;
          this.fetchPostThen(curPageContext, function (post, context) {
            if (_.isEqual(curPageContext, context)) {
              this.posts = [post];
              this.posts = _.sortBy(this.posts, this.pages[context.page].comparator);
              this.loadingNewPage = false;
              this.emit('change');
            }
          }, true);
          this.emit('change');
          break;
      } 
    });
  },

  onFetchPosts: function (payload) {
    this.waitFor(['CurPage'], function (curPageStore) {
      var curPageContext  = curPageStore.context;

      this.fetchPostsThen(curPageContext, ++this.postsPageNum, function (posts, context) {
        if (_.isEqual(curPageContext, context)) {
          var unsortedPosts = StoreHelpers.mergeCollections(this.posts, posts);
          this.posts = _.sortBy(unsortedPosts, this.pages[context.page].comparator);
          this.emit('change');  
        }
      });
    });
  },

  onToggleFollow: function (payload, type) {
    // Is the action a USER_FOLLOW or a USER_UNFOLLOW?
    var follow = (type === 'USER_FOLLOW');
    var userId = payload.userId;

    _.map(this.posts, function (post) {
      if (post.user.id === userId) {
        post.user.following = follow;
      }

      _.each(function (comment) {
        if (comment.user.id === userId) {
          comment.user.following = follow;
        }
      });

      _.each(post.favorites, function (favorite) {
        if (favorite.user.id === userId) {
          favorite.user.following = follow;
        }
      });

      _.each(post.reposts, function (repost) {
        if (repost.user.id === userId) {
          repost.user.following = follow;
        }
      });
    });

    this.emit('change');
  },

  onToggleFavorite: function (payload, type) {
    // Is the action a FAVORITE_POST or a FAVORITE_POST?
    var favorite = type === 'FAVORITE_POST';

    var post = this.getPost(payload.postId);

    if (post) {
      post.favorited = favorite;

      this.waitFor(['Favorites', 'CurUser'], function (favorites, curUserStore) {
        if (favorite) {
          post.favorites.push({user: curUserStore.user});
        } else {
          post.favorites = _.reject(post.favorites, {user: {id: curUserStore.user.id}});
        }
      });

      this.emit('change');
    }
  },

  onCreateComment: function (payload) {
    this.waitFor(['CurUser'], function (curUserStore) {
      
      var post = this.getPost(payload.postId);


      if (post) {
        var comment = {
          message: payload.message
        };

        var tempId = this.tempCommentId--;

        API.post('/api/posts/' + payload.postId + '/comments', {comment: comment}, function (err, res) {
            if (err) {
              console.log(err);
            }

            this.flux.actions.postCommentSuccess(res, payload.postId, tempId);
          }.bind(this));

        comment.id = tempId;
        comment.user = curUserStore.user;
        post.comments.push(comment);

        this.emit('change');  
      }

    });
    
  },

  onCreateCommentSuccess: function (payload) {
    var post = this.getPost(payload.postId);
    var comment = _.find(post.comments, {id: payload.tempId});

    comment.id = payload.comment.id;
    this.emit('change');
  },

  onDeleteComment: function (payload) {
    var post = this.getPost(payload.postId);

    if (post) {
      API.del('/api/posts/' + payload.postId + '/comments/' + payload.commentId, function (err, res) {
          if (err) {
            console.log(err);
          }
        });

      post.comments = _.reject(post.comments, {id: payload.commentId});
      
      this.emit('change');
    }
  },

  // We aren't actually using this right now as the /posts routes pull all the comments
  // but, when we want to move to a more optimized method of loading comments and limit /posts comments to 25
  // this method fetches all the comments from the server and updates the given post.
  onFetchComments: function (payload) {
    var post = this.getPost(payload.postId);

    if (post) {
      API.get('/api/posts/' + payload.postId + '/comments', function (err, res) {
          if (err) {
            console.log(err);
          } else {
            post.comments = StoreHelpers.mergeCollections(post.comments, res);
            this.emit('change');
          }
        }.bind(this));
    }
  },

  onExpandComments: function () {
    this.emit('change');
  },

  onAddListen: function (payload) {
    var post = this.getPost(payload.postId);

    if (post) {
      post.listens_count++;

      this.emit('change');
    }
  },

  onGoToPost: function (payload) {
    this.waitFor(['Player', 'CurPage'], function (playerStore) {
      this.posts = _.cloneDeep(playerStore.posts);

      this.postsPageNum = this.posts / 25;
      this.hasMorePosts = true;

      this.focusPostId = playerStore.curPost.id;

      this.emit('change');
    });
  },

  onPostsAdd: function (payload) {
    this.waitFor(['CurUser', 'CurPage'], function (curUserStore, curPageStore) {
      var curPageContext = curPageStore.context;
      var page = curPageContext.page;
      var userId = curPageContext.pageOpts ? curPageContext.pageOpts.userId : null;
      var curUserId = curUserStore.user.id;

      // Only add the post to the page if you are on the feed, explore, or your own user posts page.
      if (page === 'feed' || page === 'explore' || (page === 'userposts' && userId && userId === curUserId)) {
        var unsortedPosts = StoreHelpers.mergeCollections(this.posts, payload.posts);
        this.posts = _.sortBy(unsortedPosts, this.pages[page].comparator);  
      }

      this.emit('change');
    });
  },

  onNewPostSaveSuccess: function (payload) {
    if(payload.post.parent) {
      var postParent = this.getPost(payload.post.parent.id);
      postParent.reposted_by_current_user = true;
    }

    this.onPostsAdd({posts: [payload.post]});
  },

  onGoToPostSuccess: function () {
    this.focusPostId = null;
    this.emit('change');
  },

  onError: function (payload) {
    var post = this.getPost(payload.postId);
    
    if (post) {
      post.track.broken_track = true;
      this.emit('change');
    }
  },

  getPosts: function (page) {
    return this.posts;
  },

  getPost: function (postId) {
    return _.find(this.posts, {id: postId});
  },

  getState: function () {
    return {
      loading: this.loadingNewPage
    };
  }

});