var urlPattern = require('url-pattern');
var StoreHelpers = require('app/stores/StoreHelpers');
var UserHelpers = require('app/helpers/UserHelpers');

module.exports = Fluxxor.createStore({
  initialize: function(bootstrap) {
    this.initRouter();

    var match = this.matchRoute(window.location.pathname);
    var params = _.merge(match.pattern.match(window.location.pathname), {curUserId: bootstrap.curUser.id});
    match.handler({params: params, url: window.location.pathname});
  },

  actions: {
    'NAVIGATE': 'onNavigate',
    'PLAYER_GO_TO_POST': 'onGoToPost'
  },

  routes: {
    '/': 'onFeed',
    '/feed': 'onFeed',
    '/explore': 'onExplore',
    '/trending': 'onTrending',
    '/liked': 'onLiked',
    '/users/:userId': 'onUserPosts',
    '/users/:userId/posts': 'onUserPosts',
    '/users/:userId/liked': 'onUserLiked',
    '/users/:userId/followers': 'onUserFollowers',
    '/users/:userId/following': 'onUserFollowings',
    '/tags/:tag': 'onTaggedPosts',
    '/posts/:postId': 'onPost',
    '/notifications': 'onNotifications',
    '/whotofollow': 'onWhoToFollow'
  },

  initRouter: function () {
    this.routeMatchers = _.map(this.routes, function (fn, route) {
      var handler = this[fn];

      if (!handler) {
        console.error('Route handler not found: ' + fn);
      }

      return {
        pattern: urlPattern.newPattern(route),
        handler: handler
      };
    }, this);
  },

  trackPageView: function (page, url) {
    ga('send', 'pageview', {
      'page': url,
      'title': page
    });
  },

  matchRoute: function (url) {
    var match = _.find(this.routeMatchers, function (matcher) {
      return matcher.pattern.match(url);
    });

    if (!match) {
      console.error('Route not found for url: ' + url);
    }    

    return match;
  },

  /* Payload:
   *  href
   */
  onNavigate: function (payload) {
    var match = this.matchRoute(payload.href);

    if (!payload.popstate) {
      window.history.pushState(null, null, payload.href);
    }

    match.handler({params: match.pattern.match(payload.href), url: payload.href});

    $(document).trigger('closeAllPopovers');
    $(window).scrollTop(0);
  },

  onFeed: function (payload) {
    this.context = {
      page: 'feed',
      pageOpts: null
    };

    this.type = 'posts';

    this.emit('change');

    this.trackPageView('feed', payload.url);
  },

  onExplore: function (payload) {
    this.context = {
      page: 'explore',
      pageOpts: null
    };

    this.type = 'posts';

    this.emit('change');

    this.trackPageView('explore', payload.url);
  },

  onTrending: function (payload) {
    this.context = {
      page: 'trending',
      pageOpts: null
    };

    this.type = 'posts';

    this.emit('change');

    this.trackPageView('trending', payload.url);
  },

  onUserPosts: function (payload) {
    this.context = {
      page: 'userposts',
      pageOpts: {
        userId: payload.params.userId
      }
    };

    this.type = 'posts';

    this.emit('change');

    this.trackPageView('userposts', payload.url);
  },

  onLiked: function (payload) {
    if (payload.params.curUserId) {
      this.context = {
        page: 'liked',
        pageOpts: {
          userId: payload.params.curUserId
        }
      };

      this.type = 'posts';

      this.emit('change');
    } else {
      this.waitFor(['CurUser'], function (curUserStore) {
        this.context = {
          page: 'liked',
          pageOpts: {
            userId: curUserStore.user.id
          }
        };

        this.type = 'posts';

        this.emit('change');
      });  
    }

    this.trackPageView('liked', payload.url);
  },

  onUserLiked: function (payload) {
    this.context = {
      page: 'userliked',
      pageOpts: {
        userId: payload.params.userId
      }
    };

    this.type = 'posts';

    this.emit('change');

    this.trackPageView('userliked', payload.url);
  },

  onUserFollowers: function (payload) {
    this.context = {
      page: 'userfollowers',
      pageOpts: {
        userId: payload.params.userId
      }
    };

    this.type = 'users';

    this.emit('change');

    this.trackPageView('userfollowers', payload.url);
  },

  onUserFollowings: function (payload) {
    this.context = {
      page: 'userfollowings',
      pageOpts: {
        userId: payload.params.userId
      }
    };

    this.type = 'users';

    this.emit('change');

    this.trackPageView('userfollowings', payload.url);
  },

  onTaggedPosts: function (payload) {
    this.context = {
      page: 'tag',
      pageOpts: {
        tag: payload.params.tag
      }
    };

    this.type = 'posts';

    this.emit('change');

    this.trackPageView('tag', payload.url);
  },

  onPost: function (payload) {
    this.context = {
      page: 'post',
      pageOpts: {
        postId: payload.params.postId
      }
    };

    this.type = 'post';

    this.emit('change');

    this.trackPageView('post', payload.url);
  },

  onNotifications: function (payload) {
    this.context = {
      page: 'notifications',
      pageOpts: null
    };

    this.type = 'notifications';

    this.emit('change');

    this.trackPageView('notifications', payload.url);
  },

  onWhoToFollow: function (payload) {
    this.context = {
      page: 'whotofollow',
      pageOpts: null
    };

    this.type = 'users';

    this.emit('change');

    this.trackPageView('whotofollow', payload.url);
  },

  onGoToPost: function (payload) {
    this.waitFor(['Player'], function (playerStore) {

      var post = playerStore.getCurPost();

      ga('send', 'event', 'Player', 'Go to post');

      this.context = _.cloneDeep(playerStore.curPost.context);

      var url = StoreHelpers.Pages[this.context.page].appUrl(this.context.pageOpts);

      this.type = playerStore.curPost.context.page === 'post' ? 'post' : 'posts';

      window.history.pushState(null, null, url);

      this.emit('change');
    });
  },

  isCurContext: function (context) {
    return _.isEqual(context, this.context);
  },

  getState: function() {
    return this.context;
  }
});