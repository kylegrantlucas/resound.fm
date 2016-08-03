// Currently not used.
// TODO: Switch from an AJAX method call in the component to this store.
var API = require('app/lib/API');

module.exports = Fluxxor.createStore({
  initialize: function() {
    this.results = [];
    this.searching = false;
  },

  actions: {
    "NEW_POST_TRACK_SEARCH": "onSearchTracks",
    "NEW_POST_TRACK_SEARCH_SUCCESS": "onSearchTracksSuccess",
    "NEW_POST_SELECT_TRACK": "onSelectTrack"
  },

  onSearchTracks: function (payload) {
    API.get('/api/tracks', {'query': payload.query}, function (err, res) {
        if (err) {
          this.flux.dispatch('NEW_POST_TRACK_SEARCH_ERROR', {error: err});
        } else {
          this.flux.dispatch('NEW_POST_TRACK_SEARCH_SUCCESS', {results: res});
        }
      }.bind(this));

    this.searching = true;
    this.emit('change');
  },

  onSearchTracksSuccess: function (payload) {
    this.results = payload.results;
    this.searching = false;
    this.emit('change');
  },

  onSelectTrack: function () {
    this.results = [];
    this.searching = false;
    this.emit('change');
  },

  getState: function() {
    return {
      results: this.results,
      searching: this.searching
    };
  }
});