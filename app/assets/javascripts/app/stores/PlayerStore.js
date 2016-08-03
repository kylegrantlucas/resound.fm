var API = require('app/lib/API');
var TrackHelpers = require('app/helpers/TrackHelpers');
var StoreHelpers = require('app/stores/StoreHelpers');

var PlayState = {
  STOPPED: 0,
  LOADING: 1,
  PAUSED: 2,
  PLAYING: 3
};

module.exports = Fluxxor.createStore({

  initialize: function (bootstrap) {
    this.posts = _.cloneDeep(bootstrap.posts) || [];

    var initialPost = this.posts && this.posts.length > 0 ? this.posts[0] : null;
    var defaultPostId = initialPost ? initialPost.id : null;

    this.fetchingPosts = false;
    this.postsPageNum = 0;
    this.hasMorePosts = this.posts.length === 25;

    this.curPost = {
      // Currently playing post id
      id: defaultPostId, 
      
      // Current position in track (seconds).
      pos: 0,

      idx: 0,

      secondsPlayed: 0,

      listened: false,
      
      /*
        Current Post playState
        0 - Stopped
        1 - Loading
        2 - Paused
        3 - Playing
      */
      playState: 0,

      // 0 - 1
      percentLoaded: 0,
      
      // Where the player is currently playing from.
      context: null
    };

    this.preview = {
      track: null,
      pos: 0, 
      playState: 0,
      percentLoaded: 0
    };

    this.previewing = false;

    this.ytCurPostPlayer = null;
    this.ytCurPostPlayerId = 'player1';
    this.scCurPostPlayer = null;

    this.ytPreviewPlayer = null;
    this.ytPreviewPlayerId = 'player2';
    this.scPreviewPlayer = null;

    soundManager.setup({
      url: '/swf/',
      flashVersion: 9,
      debugMode: false,
      useFlashBlock: false,
      useHighPerformance: true,
      wmode: 'transparent',
      onready: this.onSCReady.bind(this)
    });
  },

  actions: {
    'YT_PLAYER_READY': 'onYTReady',
    'YT_PLAYER_STATE_CHANGE': 'onYTChangeState',

    'PLAYER_PLAY': 'onPlay',
    'PLAYER_PAUSE': 'onPause',
    'PLAYER_NEXT': 'onNext',
    'PLAYER_PREV': 'onPrev',
    'PLAYER_SEEK': 'onSeek',
    'PLAYER_ERROR': 'onError',

    'PLAYER_PLAY_PREVIEW': 'onPlayPreview',
    'PLAYER_PAUSE_PREVIEW': 'onPausePreview',
    'PLAYER_SEEK_PREVIEW': 'onSeekPreview',

    'POST_DELETE': 'onDeletePost',

    'FAVORITE_POST': 'onToggleFavorite',
    'UNFAVORITE_POST': 'onToggleFavorite',

    "NEW_POST_SHOW_REPOST_MODAL": "onShowRepostModal",
    "NEW_POST_MATCH_TRACK_SUCCESS": "onNewPostMatch",
    "NEW_POST_SELECT_TRACK": "onSelectTrack",
    "NEW_POST_GO_BACK": "onNewPostBack",
    "NEW_POST_SELECT_VIDEO": "onChangeNewPostVideo",
    "NEW_POST_SAVE_SUCCESS": "onSavePost",
    "NEW_POST_CLOSE_MODAL": "onCloseModal",

    'TRACK_SOURCE_CLICKED': 'onTrackSourceClicked'
  },

  pages: StoreHelpers.Pages,

  setInitialContext: function (context) {
    this.curPost.context = context;
    this.emit('change');
  },

  /* Payload
   *  video
   *  playerId
   */
  onYTReady: function (payload) {
    if (payload.playerId === 'player1') {
      var post = this.getCurPost();      

      this.ytCurPostPlayer = payload.video;

      if (post && TrackHelpers.isYoutube(post.track)) {
        this.setCurPost(post.id);
        this.emit('change');
      }
    } else {
      this.ytPreviewPlayer = payload.video;
    }
  },

  onSCReady: function () {
    var post = this.getCurPost();

    if (post && TrackHelpers.isSoundcloud(post.track)) {
      this.setCurPost(post.id);
      this.emit('change');
    }
  },

  isCurContext: function (context) {
    return _.isEqual(context, this.curPost.context);
  },

  isCurPost: function (postId) {
    return postId == this.curPost.id;
  },

  hasPrevPost: function () {
    var idx = _.findIndex(this.posts, { 'id': this.curPost.id });

    return idx > 0;
  },

  getPrevPost: function () {
    var curIdx = _.findIndex(this.posts, { 'id': this.curPost.id });
    
    return this.posts[curIdx - 1];
  },

  hasNextPost: function () {
    var idx = _.findIndex(this.posts, { 'id': this.curPost.id });

    return idx < this.posts.length - 1;
  },

  getNextPost: function () {
    var curIdx = _.findIndex(this.posts, { 'id': this.curPost.id });
    
    return this.posts[curIdx + 1];
  },

  getPost: function (postId) {
    var post = _.find(this.posts, {id: postId});

    if (!post) {
      console.error('Post id: ' + postId + ' not found. Posts: ', this.posts);
    }

    return post;
  },

  getPostIndex: function (postId) {
    return _.findIndex(this.posts, { 'id': postId });
  },

  getCurPost: function () {
    var post = _.find(this.posts, {id: this.curPost.id});

    if (!post) {
      console.error('CurPost id: ' + this.curPost.id + ' not found. Posts: ', this.posts);
    }

    return post; 
  },

  getCurPostIdx: function () {
    return _.findIndex(this.posts, { 'id': this.curPost.id });
  },

  setCurPost: function (postId, pos) {
    var post = this.getPost(postId);
    var key = post.track.key;
    pos = pos || 0;

    var idx = _.findIndex(this.posts, { 'id': postId });

    this.curPost.id = postId;
    this.curPost.idx = idx;
    this.curPost.pos = pos;
    this.curPost.listened = false;
    this.curPost.secondsPlayed = 0;

    if (TrackHelpers.isYoutube(post.track)) {
      if (this.scCurPostPlayer) {
        this.scStopPosTimer();
        this.scCurPostPlayer.destruct();
      }

      this.ytCurPostPlayer.cueVideoById(key, pos, "hd720");
    } else if (TrackHelpers.isSoundcloud(post.track)) {
      if (this.ytCurPostPlayer) {
        this.ytCurPostPlayer.stopVideo();
      }

      if (this.scCurPostPlayer) {
        this.scStopPosTimer();
        this.scCurPostPlayer.destruct();
      }

      this.scCurPostPlayer = soundManager.createSound({
        id: key,
        position: pos,
        autoLoad: true,
        url: 'http://api.soundcloud.com/tracks/' + key + '/stream?client_id=' + window.SOUNDCLOUD_ID,
        onplay: function () {
          this.scStartPosTimer();
        }.bind(this),
        onresume: function () {
          this.scStartPosTimer();
        }.bind(this),
        onpause: function () {
          this.scStopPosTimer();
        }.bind(this),
        onstop: function () {
          this.scStopPosTimer();
        }.bind(this),
        onfinish: function () {
          this.scStopPosTimer();
          if (!this.previewing) {
            this.flux.actions.playerNext(true);
          }
        }.bind(this),
        onload: function (success) {
          if (!success) {
            this.flux.actions.playerLoadError(this.curPost.id);  
          }
        }.bind(this)
      });
    } else {
      console.error('Invalid track provider');
    }    
  },

  setPreviewTrack: function (track, pos, autoplay) {
    var key = track.key;
    pos = pos || 0;

    this.preview.playState = PlayState.PAUSED;
    this.preview.track = track;
    this.preview.pos = pos;
    this.previewing = true;

    if (TrackHelpers.isYoutube(track)) {
      if (this.scPreviewPlayer) {
        this.scStopPosTimer();
        this.scPreviewPlayer.destruct();
      }

      if (autoplay) {
        this.ytPreviewPlayer.loadVideoById(key, pos, "hd720");
      } else {
        this.ytPreviewPlayer.cueVideoById(key, pos, "hd720");
      }
    } else if (TrackHelpers.isSoundcloud(track)) {

      if (this.ytPreviewPlayer) {
        this.ytPreviewPlayer.stopVideo();
      }

      if (this.scPreviewPlayer) {
        this.scPreviewPlayer.destruct();
      }

      this.scPreviewPlayer = soundManager.createSound({
        id: key,
        position: pos,
        autoPlay: autoplay,
        autoLoad: true,
        url: 'http://api.soundcloud.com/tracks/' + key + '/stream?client_id=' + window.SOUNDCLOUD_ID,
        onplay: function () {
          this.scStartPosTimer();
        }.bind(this),
        onresume: function () {
          this.scStartPosTimer();
        }.bind(this),
        onpause: function () {
          this.scStopPosTimer();
        }.bind(this),
        onstop: function () {
          this.scStopPosTimer();
        }.bind(this),
        onfinish: function () {
          this.scStopPosTimer();
          if (!this.previewing) {
            this.flux.actions.playerNext(true);
          }
        }.bind(this),
        onload: function (success) {
          if (!success) {
            this.flux.actions.playerLoadError();  
          }
        }.bind(this)
      });
    } else {
      console.error('Invalid track provider');
    }
  },

  /* Payload
   *  playState
   */
  onYTChangeState: function (payload) {
    switch (payload.playState) {
      case YT.PlayerState.UNSTARTED:
        if (payload.playerId !== this.ytPreviewPlayerId) {
          this.ytStopPosTimer();
        }
        break;
      case YT.PlayerState.PLAYING:
        if (payload.playerId === this.ytPreviewPlayerId) {
          this.pauseCurPost();
          this.preview.playState = PlayState.PLAYING;
        } else {
          this.ytStartPosTimer();
          this.curPost.playState = PlayState.PLAYING;  
        }     
        this.emit('change');
        break;
      case YT.PlayerState.PAUSED:
        if (payload.playerId === this.ytPreviewPlayerId) {
          this.preview.playState = PlayState.PAUSED;
        } else {
          this.ytStopPosTimer();
          this.curPost.playState = PlayState.PAUSED;  
        }
        this.emit('change');
        break;
      case YT.PlayerState.ENDED:
        if (payload.playerId !== this.ytPreviewPlayerId) {
          this.ytStopPosTimer();
          _.defer(this.flux.actions.playerNext, true);
        }
        break;
    }
  },

  ytStartPosTimer: function() {
    this.ytStopPosTimer();

    this.ytPosTimer = setInterval(_.bind(this.ytWhilePlaying, this), 500);
  },

  ytStopPosTimer: function () {
    if (this.ytPosTimer) {
      clearInterval(this.ytPosTimer);
    }
  },

  ytWhilePlaying: function () {
    if (this.previewing) {
      this.preview.pos = this.ytPreviewPlayer.getCurrentTime();
    } else {
      this.curPost.pos = this.ytCurPostPlayer.getCurrentTime();
      this.incrementSecondsPlayed();
    }

    this.emit('change:pos');
  },

  scStartPosTimer: function() {
    this.scStopPosTimer();
    this.scPosTimer = setInterval(_.bind(this.scWhilePlaying, this), 500);
  },

  scStopPosTimer: function () {
    if (this.scPosTimer) {
      clearInterval(this.scPosTimer);
    }
  },

  scWhilePlaying: function () {
    if (this.previewing) {
      this.preview.pos = this.scPreviewPlayer.position / 1000;
    } else {
      this.curPost.pos = this.scCurPostPlayer.position / 1000;
      this.incrementSecondsPlayed();
    }

    this.emit('change:pos');
  },

  incrementSecondsPlayed: function () {
    this.curPost.secondsPlayed += 0.5;

    if (this.curPost.secondsPlayed > 10 && !this.curPost.listened) {
      this.curPostListen();
    }
  },

  curPostListen: function () {
    var postId = this.curPost.id;
    
    if (!this.curPost.listened) {
      this.curPost.listened = true; 

      API.post('/api/posts/' + postId + '/listens', function (err, res) {
          if (err) {
            console.error(err);
          }
        }.bind(this));

      _.defer(this.flux.actions.listenedToPost, postId);

       
    }
  },

  resetPreview: function () {
    this.preview = {
      track: null,
      pos: 0, 
      playState: PlayState.STOPPED,
      percentLoaded: 0
    };
  },

  isCurPreview: function (track) {
    return _.isEqual(track, this.preview.track);
  },

  ensureVolumeSet: function (player) {
    if (player.getVolume() !== 100) {
      player.setVolume(100);  
    }

    if (player.isMuted()) {
      player.unMute();
    }
  },

  playCurPost: function () {
    var post = this.getCurPost();

    if (TrackHelpers.isYoutube(post.track)) {
      this.ensureVolumeSet(this.ytCurPostPlayer);
      this.ytCurPostPlayer.playVideo();
    } else if (TrackHelpers.isSoundcloud(post.track)) {
      this.scCurPostPlayer.play();
    } else {
      console.error('Invalid track provider');
    }

    this.curPost.playState = PlayState.PLAYING;
  },

  playCurPreview: function () {
    var track = this.preview.track;

    if (this.isCurPostPlaying) {
      this.pauseCurPost();
    }

    if (TrackHelpers.isYoutube(track)) {
      this.ensureVolumeSet(this.ytCurPostPlayer);
      this.ytPreviewPlayer.playVideo();
    } else if (TrackHelpers.isSoundcloud(track)) {
      this.scPreviewPlayer.play();
    } else {
      console.error('Invalid track provider');
    }

    this.preview.playState = PlayState.PLAYING;
  },

  pauseCurPost: function () {
    var post = this.getCurPost();

    if (TrackHelpers.isYoutube(post.track)) {
      this.ytCurPostPlayer.pauseVideo();
    } else if (TrackHelpers.isSoundcloud(post.track)) {
      this.scCurPostPlayer.pause();
    } else {
      console.error('Invalid track provider');
    }

    this.curPost.playState = PlayState.PAUSED;
  },

  pauseCurPreview: function () {
    var track = this.preview.track;

    if (TrackHelpers.isYoutube(track)) {
      this.ytPreviewPlayer.pauseVideo();
    } else if (TrackHelpers.isSoundcloud(track)) {
      this.scPreviewPlayer.pause();
    } else {
      console.error('Invalid track provider');
    }

    this.preview.playState = PlayState.PAUSED;
  },

  seekCurPost: function (pos) {
    var post = this.getCurPost();

    if (TrackHelpers.isYoutube(post.track)) {
      this.ytCurPostPlayer.seekTo(pos, true);
    } else if (TrackHelpers.isSoundcloud(post.track)) {
      this.scCurPostPlayer.setPosition(pos * 1000);
    } else {
      console.error('Invalid track provider');
    }

    this.curPost.secondsPlayed = 0;
    this.curPost.pos = pos;
  },

  seekCurPreview: function (pos) {
    var track = this.preview.track;

    if (TrackHelpers.isYoutube(track)) {
      this.ytPreviewPlayer.seekTo(pos, true);
    } else if (TrackHelpers.isSoundcloud(track)) {
      this.scPreviewPlayer.seek(pos);
    } else {
      console.error('Invalid track provider');
    }

    this.preview.pos = pos;
  },

  stopCurPreview: function () {
    var track = this.preview.track;

    if (TrackHelpers.isYoutube(track)) {
      if (this.ytPreviewPlayer) {
        this.ytPreviewPlayer.stopVideo();  
      }
    } else if (TrackHelpers.isSoundcloud(track)) {
      if (this.scPreviewPlayer) {
        this.scPreviewPlayer.destruct();  
      }
    } else {
      console.error('Invalid track provider');
    }

    this.preview.playState = PlayState.STOPPED;
  },

  isCurPostPlaying: function () {
    return this.curPost.playState === PlayState.PLAYING;
  },

  isPreviewPlaying: function () {
    return this.preview.playState === PlayState.PLAYING;
  },

  ensureCurPageContextThen: function (cb) {
    this.waitFor(['PagePosts', 'CurPage'], function (pagePostsStore, curPageStore) {
      var curPageContext = curPageStore.getState();
      var changedContext = false;

      this.posts = _.cloneDeep(pagePostsStore.getPosts(curPageContext.page));

      if (!this.isCurContext(curPageContext)) {
        this.curPost.context = _.cloneDeep(curPageContext);
        changedContext = true;   
      }
      
      cb.call(this, changedContext);
    });
  },

  swapPlayers: function () {
    var oldPreviewPlayer = this.ytPreviewPlayer;
    var oldPreviewPlayerId = this.ytPreviewPlayerId;

    this.ytPreviewPlayer = this.ytCurPostPlayer;
    this.ytPreviewPlayerId = this.ytCurPostPlayerId;
    
    this.ytCurPostPlayer = oldPreviewPlayer;
    this.ytCurPostPlayerId = oldPreviewPlayerId;

    var oldSCPreviewPlayer = this.scPreviewPlayer;
    this.scPreviewPlayer = this.scCurPostPlayer; 
    this.scCurPostPlayer = oldSCPreviewPlayer;
  },

  fetchPostsThen: function (context, pageNum, cb, force) {
    if ((!this.fetchingPosts && this.hasMorePosts) || force) {
      this.fetchingPosts = true;

      API.get(this.pages[context.page].url(context.pageOpts), {p: pageNum}, function (err, res) {
          if (err) {
            console.error(err);
          } else {
            if (!res || res.length < 25) {
              this.hasMorePosts = false;
            }

            res = res || [];
            this.fetchingPosts = false;
            cb.call(this, res);
          }
        }.bind(this));
    }
  },

  /* Payload:
   *  postId
   *  context
   */
  onPlay: function (payload) {
    if (payload.location === 'footer') {
      // Resume the current song.
      this.previewing = false;
      this.playCurPost();

      this.emit('change');
    } else {
      // Fetch the posts from the page and ensure the context is set
      this.ensureCurPageContextThen(function (changedContext) {

        // Set the current post if it changed.
        if (!this.isCurPost(payload.postId) || changedContext) {
          this.setCurPost(payload.postId);
        }
        
        // Play the current post
        this.previewing = false;
        this.playCurPost();

        this.emit('change');
      });  
    }
    
  },

  /* Payload:
   *  track
   */
  onPlayPreview: function (payload) {
    if (this.isCurPostPlaying()) {
      this.pauseCurPost();
    }

    if (!this.isCurPreview(payload.track)) {
      this.setPreviewTrack(payload.track);
    }

    this.previewing = true;
    this.playCurPreview();

    this.emit('change');
  },

  /* Payload:
   *  post
   */
  onSavePost: function (payload) {
    if (this.isPreviewPlaying()) {
      // Need to rethink this. Currently you can screw up the player state by pressing 
      // next between the bost being saved and the feed being fetched.
      this.fetchPostsThen({page:'feed'}, 0, function (posts) {
        this.posts = posts;

        this.curPost.context = {
          page: 'feed',
          pageOpts: null
        };

        this.curPost.id = payload.post.id;
        this.curPost.playState = this.preview.playState;
        this.curPost.pos = this.preview.pos;

        this.resetPreview();

        this.previewing = false;

        this.swapPlayers();

        if (TrackHelpers.isYoutube(payload.post.track)) {
          this.ytStartPosTimer();  
        } else {
          this.scStartPosTimer();  
        }

        _.defer(this.flux.actions.playerReadyAfterPost);

        this.emit('change');
      }, true);
    } else {
      this.waitFor(['CurPage'], function (curPageStore) {
        var curPageContext = curPageStore.getState();

        this.resetPreview();
        this.previewing = false;

        if (this.isCurContext(curPageContext)) {
          this.posts.push(payload.post);
          this.posts = _.sortBy(this.posts, this.pages[this.curPost.context.page].comparator);
        }

        _.defer(this.flux.actions.playerReadyAfterPost);

        this.emit('change');
      });
    }
  },

  onCloseModal: function () {
    if (this.preview.track) {
      this.stopCurPreview();
      this.resetPreview();  
    }
    
    this.previewing = false;
    this.emit('change');
  },

  onPause: function () {
    this.pauseCurPost();
    this.emit('change');
  },

  onPausePreview: function () {
    this.pauseCurPreview();
    this.emit('change');
  },

  /* Payload:
   *  pos
   */
  onSeek: function (payload) {
    this.seekCurPost(payload.pos);
    this.emit('change');
  },

  /* Payload:
   *  pos
   */
  onSeekPreview: function (payload) {
    this.seekCurPreview(payload.pos);
    this.emit('change');
  },

  onNext: function (payload) {
    var oldCurPostId = this.curPost.id;

    if (this.hasNextPost()) {
      var nextPost = this.getNextPost();

      this.setCurPost(nextPost.id);
      
      this.playCurPost();

      if (payload.deletePost) {
        this.posts = _.reject(this.posts, {id: oldCurPostId});
      }

      this.emit('change');
    } else {
      if (!this.fetchingPosts) {
        if (this.hasMorePosts) {
          this.fetchPostsThen(this.curPost.context, ++this.postsPageNum, function (posts) {
            var unsortedPosts = StoreHelpers.mergeCollections(this.posts, posts);
            this.posts = _.sortBy(this.posts, this.pages[this.curPost.context.page].comparator);
            
            var nextPost = this.getNextPost();

            this.setCurPost(nextPost.id);
            
            this.playCurPost();

            if (payload.deletePost) {
              this.posts = _.reject(this.posts, {id: oldCurPostId});  
            }

            this.emit('change');
          });  
        } else if (this.posts.length > 0) {
          var firstPost = this.posts[0];

          this.setCurPost(firstPost.id);
          
          this.playCurPost();

          if (payload.deletePost) {
            this.posts = _.reject(this.posts, {id: oldCurPostId});
          }

          this.emit('change');
        }
      }
    }
  },

  onError: function (payload) {
    this.waitFor(['PagePosts'], function () {
      if (this.previewing) {
        if (this.preview.track) {
          this.preview.track.broken_track = true;  
        }
        
        this.pauseCurPreview();
        this.emit('change');
      } else {

        this.onNext(payload);
      }  
    });
  },

  onPrev: function () {
    if (this.curPost.pos < 3) {
      if (this.hasPrevPost()) {
        var prevPost = this.getPrevPost();

        this.setCurPost(prevPost.id);
        
        this.playCurPost();

        this.emit('change');

        return;
      }
    }

    this.seekCurPost(0);
    this.emit('change');
  },

  onSelectTrack: function (payload) {
    if (payload.track.provider === 'soundcloud') {
      this.onNewPostMatch(payload);
    }
  },

  /* Payload:
   *  track
   */
  onNewPostMatch: function (payload) {
    this.setPreviewTrack(payload.track);

    this.previewing = true;

    this.emit('change');
  },

  /* Payload:
   *  post
   */
  onShowRepostModal: function (payload) {
    this.setPreviewTrack(payload.repost.track);

    this.emit('change');
  },

  /* Payload:
   *  videoKey
   */
  onChangeNewPostVideo: function (payload) {
    var track = this.preview.track;
    track.key = payload.video.key;

    this.setPreviewTrack(track, 0, true);

    this.emit('change');
  },

  onNewPostBack: function () {
    this.stopCurPreview();
    this.resetPreview();
    this.previewing = false;
    this.emit('change');
  },

  onDeletePost: function (payload) {
    if (this.isCurPost(payload.postId)) {
      this.onNext({deletePost: true});
    } else {
      this.posts = _.reject(this.posts, {id: payload.postId});
      this.emit('change');
    }
  },

  onTrackSourceClicked: function () {
    if (this.previewing) {
      this.pauseCurPreview();
      this.emit('change');
    } else {
      this.pauseCurPost();
    }

    this.emit('change');
  },

  onToggleFavorite: function (payload, type) {
    // Is the action a FAVORITE_POST or a UNFAVORITE_POST?
    var favorite = type === 'FAVORITE_POST';
    
    if (this.isCurPost(payload.postId)) {
      var post = this.getCurPost();

      post.favorited = favorite;

      this.waitFor(['Favorites', 'CurUser'], function (favorites, curUserStore) {
        if (favorite) {
          post.favorites.push({user: curUserStore.user});
        } else {
          post.favorites = _.reject(post.favorites, {user: {id: curUserStore.user.id}});
        }
      });

      this.emit('change');
    }
  },

  getCurPlayerId: function () {
    // if (this.previewing) {
    //   if (this.preview.track && TrackHelpers.isYoutube(this.preview.track) && this.ytPreviewPlayer) {
    //     return this.ytPreviewPlayerId;
    //   } else {
    //     return null;
    //   }
    // } else {
    //   var curPost = this.getCurPost();

    //   if (curPost && TrackHelpers.isYoutube(curPost.track) && this.ytCurPostPlayer && (this.ytCurPostPlayer.getPlayerState() === YT.PlayerState.PAUSED || this.ytCurPostPlayer.getPlayerState() === YT.PlayerState.PLAYING)) {
    //     return this.ytCurPostPlayerId;
    //   } else {
    //     return null;
    //   }
    // }

    // Hey HoverPlayer Fuck You! :D

    return null;
  },

  getState: function (payload) {
    var curPost = this.curPost;

    curPost.idx = this.getCurPostIdx();

    return {
      previewing: this.previewing,
      curPost: curPost,
      preview: this.preview
    }
  }


});