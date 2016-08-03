var API = require('app/lib/API');

module.exports = Fluxxor.createStore({

  initialize: function () {
    
  },

  actions: {
    'FAVORITE_POST': 'onFavorite',
    'UNFAVORITE_POST': 'onUnfavorite'
  },

  onFavorite: function (payload) {
    API.post('/api/posts/' + payload.postId + '/favorites');
  },

  onUnfavorite: function (payload) {
    API.del('/api/posts/' + payload.postId + '/favorites');
  }

});