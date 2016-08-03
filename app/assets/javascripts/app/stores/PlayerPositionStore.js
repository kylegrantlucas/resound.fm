module.exports = Fluxxor.createStore({
  initialize: function() {
    this.pos = {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 70,
      width: 0
    };

    this.newPostShown = false;
  },

  actions: {
    'PLAYER_POSITION_CHANGE': 'onChangePos',
    'NEW_POST_PLAYER_SHOW': 'onShowPreview',
    'NEW_POST_PLAYER_HIDE': 'onHidePreview',
    'NEW_POST_PLAYER_POSITION_CHANGE': 'onChangePreviewPos',
  },

  onChangePos: function (payload) {
    if (!this.newPostShown) {
      this.pos = payload.pos;
      this.emit('change');  
    }
  },

  onShowPreview: function (payload) {
    this.newPostShown = true;
    this.pos = payload.pos;
    this.emit('change');
  },

  onHidePreview: function () {
    this.newPostShown = false;
    this.emit('change');
  },

  onChangePreviewPos: function (payload) {
    this.pos = payload.pos;
    this.emit('change');
  },

  getPos: function () {
    return this.pos;
  },

  getZIndex: function () {
    return this.newPostShown ? 10000 : 'inherit';
  }
});