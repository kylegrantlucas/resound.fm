var API = require('app/lib/API');

module.exports = Fluxxor.createStore({
  initialize: function(bootstrap) {
    this.recommendations = bootstrap.followingRecs || [];
  },

  actions: {
    'USER_RECS_CHANGE': 'onChanges',
    'USER_FOLLOW': 'onDismiss',
    'USER_REC_DISMISS': 'onDismiss'
  },

  onChange: function (payload) {
    this.recommendations = payload.recommendations;
    this.emit('change');
  },

  onDismiss: function (payload) {
    this.waitFor(["CurUser"], function (curUserStore) {
      this.recommendations = _.reject(this.recommendations, {id: payload.userId});

      API.del("/api/users/" + curUserStore.user.id + "/suggested_users/" + payload.userId);

      this.emit('change');
    });
  },

  getState: function() {
    return {
      recommendations: this.recommendations
    };
  }
});