var API = require('app/lib/API');

module.exports = Fluxxor.createStore({
  initialize: function(bootstrap) {
    this.user = bootstrap.curUser;
  },

  actions: {
    'CUR_USER_UPDATE_BIO': 'onUpdateBio',
    'CUR_USER_DISMISS_BIO_CALLOUT': 'onDismissBioCallout',
    'USER_FOLLOW': 'onFollow',
    'USER_UNFOLLOW': 'onUnfollow'
  },

  onUpdateBio: function (payload) {
    API.put('/api/users/' + this.user.id, {bio: payload.bio, user_page_bio_callout_id: 0});

    this.user.bio = payload.bio;
    this.user.user_page_bio_callout_id = 0;

    this.emit('change');
  },

  onFollow: function () {
    this.user.following_count++;
    this.emit('change');
  },

  onUnfollow: function () {
    this.user.following_count--;
    this.emit('change');
  },

  onDismissBioCallout: function () {
    API.put('/api/users/' + this.user.id, {user_page_bio_callout_id: 0});

    this.user.user_page_bio_callout_id = 0;

    this.emit('change');
  },

  profileUrl: function () {
    return '/users/' + this.user.username;
  },

  profileIdUrl: function () {
    return '/users/' + this.user.id;
  },

  getState: function() {
    return {
      user: this.user
    };
  }
});