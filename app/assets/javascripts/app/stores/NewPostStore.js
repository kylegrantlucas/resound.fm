var API = require('app/lib/API');

module.exports = Fluxxor.createStore({
  initialize: function() {
    this.reset();
  },

  reset: function () {
    this.modalShown = false;
    this.newPost = {};
    this.posting = false;
    this.matching = false;
    this.repost = false;
    this.page = 'track-search';
  },

  actions: {
    "NEW_POST_SHOW_POST_MODAL": "onShowPostModal",
    "NEW_POST_SHOW_REPOST_MODAL": "onShowRepostModal",
    "NEW_POST_SELECT_TRACK": "onSelectTrack",
    "NEW_POST_MATCH_TRACK_SUCCESS": "onMatchTrackSuccess",
    "NEW_POST_GO_BACK": "onGoBack",
    "NEW_POST_SELECT_VIDEO": "onSelectVideo",
    "NEW_POST_SAVE": "onSavePost",
    "NEW_POST_SAVE_SUCCESS": "onSavePostSuccess",
    "NEW_POST_PLAYER_READY": "onPlayerReadyAfterPost",
    "NEW_POST_CLOSE_MODAL": "onCloseModal"
  },

  onShowPostModal: function () {
    this.waitFor(['CurUser'], function (CurUserStore) {
      this.modalShown = true;
      this.newPost.user = CurUserStore.user;
      this.emit("change");
    });
  },

  onShowRepostModal: function (payload) {
    this.waitFor(['CurUser'], function (CurUserStore) {
      this.modalShown = true;
      this.repost = true;
      
      var repost = payload.repost;
      
      this.newPost = {
        id: repost.id,
        user: CurUserStore.user,
        track: repost.track,
        message: "via @" + repost.user.username + " \"" + repost.message + "\""
      };

      this.page = 'compose-post';
      
      this.emit("change");
    });
  },

  onSelectTrack: function (payload) {
    this.page = 'compose-post';
    this.matching = true;
    this.newPost.track = payload.track;
    
    if (payload.track.provider === 'itunes') {
        API.post('/api/match', {id: payload.track.itunes_id}, function (err, res) {
          if (err) {
            return console.log(err);
          }
          this.matching = false;
          this.emit('change');
          this.flux.actions.matchNewPostSuccess(res);
        }.bind(this));  
    }

    this.emit("change");
  },

  onMatchTrackSuccess: function (payload) {
    this.newPost.track = payload.track;
    this.emit("change");
  },

  onGoBack: function () {
    this.page = 'track-search';
    this.newPost.track = null;
    this.emit("change");
  },

  onSelectVideo: function (payload) {
    this.newPost.track.key = payload.video.key;
    this.newPost.video_id = payload.video.id;
    this.newPost.track.broken_track = false;
    this.emit("change");
  },

  onSavePost: function(payload) {
    this.newPost.message = payload.message;
    var url = this.repost ? '/api/posts/' + this.newPost.id + '/repost' : '/api/posts';

    API.post(url, this.newPost, function (err, res) {
        if (err) {
          return console.log(err);
        }

        this.flux.actions.saveNewPostSuccess(res);
      }.bind(this));

    this.posting = true;

    this.emit("change");
  },

  onPlayerReadyAfterPost: function (payload) {
    this.reset();
    this.emit("change");
  },

  onCloseModal: function () {
    this.reset();
    this.emit("change");
  },

  getState: function() {
    return {
      modalShown: this.modalShown,
      newPost: this.newPost,
      posting: this.posting,
      matching: this.matching,
      repost: this.repost,
      page: this.page
    };
  }
});