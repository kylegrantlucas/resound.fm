var API = require('app/lib/API');

module.exports = Fluxxor.createStore({

  initialize: function (bootstrap) {
    this.users = bootstrap.followers || [];
  },

  actions: {
    'NAVIGATE': 'onNavigate',
    'FOLLOWERS_FETCH': 'onFetch',
    'FOLLOWERS_ADD': 'onAddFollowers',
    'USER_FOLLOW': 'onFollow',
    'USER_UNFOLLOW': 'onUnfollow'
  },

  onNavigate: function (payload) {
    this.waitFor(['CurPage'], function (curPageStore) {
      var context = curPageStore.getState();
      
      if (context.page === 'userfollowers') {
        this.onFetch({userId: context.pageOpts.userId});
      } 
    });
  },

  onFetch: function (payload) {
      API.get('/api/users/' + payload.userId + '/followers', null, function (err, res) {
        if (err) {
          return console.log(err);
        }

        this.users = res;
        this.emit('change');
      }.bind(this));
  },

  onFollow: function (payload) {
    var user = this.getUser(payload.userId);

    if (user) {
      user.following = true;
    }

    this.emit('change');
  },

  onUnfollow: function (payload) {
    var user = this.getUser(payload.userId);

    if (user) {
      user.following = false;
    }

    this.emit('change'); 
  },

  getUser: function (userIdOrName) {
    return _.find(this.users, function(user) {
      return userIdOrName === user.id || userIdOrName === user.username;
    });
  },

  getUsers: function () {
    return this.users;
  }

});