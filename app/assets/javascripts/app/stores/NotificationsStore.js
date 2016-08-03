var API = require('app/lib/API');
var StoreHelpers = require('app/stores/StoreHelpers');

module.exports = Fluxxor.createStore({
  initialize: function(bootstrap) {
    this.notifications = bootstrap.notifications ? bootstrap.notifications.items || [] : [];
    this.unreadCount = bootstrap.curUser ? bootstrap.curUser.unread_notification_count || 0 : 0;
    this.hasMore = true;
    this.pageNum = 0;
    this.loading = false;
  },

  actions: {
    'NOTIFICATIONS_ADD': 'onAdd',
    'NOTIFICATIONS_MARK_READ': 'markRead',
    'NOTIFICATIONS_FETCH': 'onFetch'
  },

  onAdd: function (payload) {
    this.notifications = StoreHelpers.mergeCollections(this.notifications, payload.notifications);
    this.emit('change');
  },

  markRead: function () {

    this.waitFor(['CurUser'], function (CurUserStore) {
      API.post('/api/users/' + CurUserStore.user.id + '/notifications/read', function (err, res) {
          if (err) {
            return console.log(err);
          }
        });

      this.unreadCount = 0;

      this.emit('change');
    });
  },

  onFetch: function () {
    if (!this.loading) {
      this.waitFor(['CurUser'], function (CurUserStore) {
        API.get('/api/users/' + CurUserStore.user.id + '/notifications', {p: this.pageNum, limit: 25}, function (err, res) {
            if (err) {
              console.log(err);
            } else {
              if (!res || res.length < 25) {
                this.hasMore = false;
              }

              this.loading = false;
              
              this.emit('change');

              if (res && res.length > 0) {
                this.flux.actions.addNotifications(res);
              } 
            }
          }.bind(this));

          this.loading = true;
          this.pageNum++;
          this.emit('change');
      });  
    }
  },

  getSortedNotifications: function () {
    return _.sortBy(this.notifications, function(n){ return -new Date(n.created_at).getTime(); });
  },

  getState: function() {
    return {
      items: this.getSortedNotifications(),
      unreadCount: this.unreadCount,
      hasMore: this.hasMore,
      loading: this.loading
    };
  }
});