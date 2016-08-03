var API = require('app/lib/API');

module.exports = Fluxxor.createStore({

  initialize: function (bootstrap) {
    this.users = bootstrap.user ? [bootstrap.user] : [];
  },

  actions: {
    'NAVIGATE': 'onNavigate',
    'USER_FETCH': 'onFetch',
    'USER_FOLLOW': 'onFollow',
    'USER_UNFOLLOW': 'onUnfollow'
  },

  fetchUserThen: function (userId, cb) {
    API.get('/api/users/' + userId, function (err, res) {
        if (err) {
          return console.log(err);
        }

        cb.call(this, res);
      }.bind(this));
  },

  onNavigate: function (payload) {
    this.waitFor(['CurPage'], function (curPageStore) {
      var context = curPageStore.getState();
      
      switch (context.page) {
        case 'userposts':
        case 'userliked':
        case 'userfollowers':
        case 'userfollowings':
          var user = this.getUser(context.pageOpts.userId);
          if (!user) {
            this.onFetch({userId: context.pageOpts.userId});
          } else{
            this.emit('change');
          }
        break;
      } 
    });
  },

  onFetch: function (payload) {
    this.fetchUserThen(payload.userId, function (user) {
      this.users.push(user);
      this.emit('change');  
    })
  },

  onFollow: function (payload) {
    this.waitFor(['CurUser'], function (curUserStore) {
      API.post('/api/users/' + payload.userId + '/followers', function (err, res) {
          if (err) {
            return console.log(err);
          }
        }.bind(this));

      var user = this.getUser(payload.userId);

      if (user) {
        user.following = true;
        user.followers_count++;
      }

      var curUser = this.getUser(curUserStore.user.id);

      if (curUser) {
        curUser.following_count++;  
      }

      this.emit('change');  
    });
  },

  onUnfollow: function (payload) {
    this.waitFor(['CurUser'], function (curUserStore) {
      API.del('/api/users/' + payload.userId + '/followers', function (err, res) {
          if (err) {
            return console.log(err);
          }
        }.bind(this));

      var user = this.getUser(payload.userId);

      if (user) {
        user.following = false;
        user.followers_count--;
      }

      var curUser = this.getUser(curUserStore.user.id);

      if (curUser) {
        curUser.following_count--;  
      }

      this.emit('change');
    });
  },

  getUser: function (userIdOrName) {
    return _.find(this.users, function(user) {
      return userIdOrName === user.id || userIdOrName === user.username;
    });
  }

});