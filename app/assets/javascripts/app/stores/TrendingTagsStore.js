module.exports = Fluxxor.createStore({
  initialize: function(bootstrap) {
    this.tags = bootstrap.trendingTags;
  },

  actions: {
    'TRENDING_TAGS_CHANGE': 'onChange'
  },

  onChange: function (payload) {
    this.tags = payload.tags;
    this.emit('change');
  },

  getState: function() {
    return {
      tags: this.tags
    };
  }
});