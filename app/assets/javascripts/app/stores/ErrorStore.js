module.exports = Fluxxor.createStore({
  initialize: function() {
    
  },

  actions: {
    'NEW_POST_SEARCH_TRACKS_ERROR': 'onError',
    'NEW_POST_MATCH_TRACK_ERROR': 'onError',
    'NEW_POST_SAVE_ERROR': 'onError',
    'CUR_USER_UPDATE_BIO_ERROR': 'onError',
    'NOTIFICATIONS_MARK_READ_ERROR': 'onError',
    'NOTIFICATIONS_FETCH_ERROR': 'onError'
  },

  onError: function (payload, type) {
    console.error(type, payload);
  }
});