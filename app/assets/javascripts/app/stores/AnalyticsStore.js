var TrackHelpers = require('app/helpers/TrackHelpers');
var UserHelpers = require('app/helpers/UserHelpers');

module.exports = Fluxxor.createStore({

  initialize: function (bootstrap) {

  },

  actions: {
    'PLAYER_PLAY': 'onPlay',
    'PLAYER_NEXT': 'onNext',

    'LISTEN_POST': 'onListened',

    'PLAYER_PLAY_PREVIEW': 'onPlayPreview',

    "NEW_POST_SHOW_POST_MODAL": "onShowPostModal",
    "NEW_POST_SHOW_REPOST_MODAL": "onShowRepostModal",
    "NEW_POST_SELECT_TRACK": "onSelectTrack",
    "NEW_POST_GO_BACK": "onNewPostBack",
    "NEW_POST_SELECT_VIDEO": "onSelectVideo",
    "NEW_POST_SAVE_SUCCESS": "onSavePost",
    "NEW_POST_CLOSE_MODAL": "onCloseModal",

    'TRACK_SOURCE_CLICKED': 'onTrackSourceClicked',

    'CUR_USER_UPDATE_BIO': 'onUpdateBio',
    'CUR_USER_DISMISS_BIO_CALLOUT': 'onDismissBioCallout',

    'USER_FOLLOW': 'onToggleFollow',
    'USER_UNFOLLOW': 'onToggleFollow',
    
    'FAVORITE_POST': 'onToggleFavorite',
    'UNFAVORITE_POST': 'onToggleFavorite',

    'COMMENT_CREATE': 'onCreateComment',
    'COMMENT_DELETE': 'onDeleteComment',

    'POST_EXPAND_COMMENTS': 'onExpandComments'
  },

  onPlay: function (payload) {
    this.waitFor(['PagePosts', 'CurPage'], function (pagePosts, curPage) {
      var post = pagePosts.getPost(payload.postId);

      if (post) {
        ga('send', 'event', 'Track', 'Started');
      }
    });
  },

  onNext: function (payload) {
    this.waitFor(['Player'], function (player) {
      var prevPost;

      if (player.hasPrevPost()) {
        prevPost = player.getPrevPost();  
      }
      
      if (prevPost) {
        if (payload.finishedSong) {
          ga('send', 'event', 'Track', 'Playthrough');
        } else {
          ga('send', 'event', 'Track', 'Skip');
        }
      }
    });
  },

  onListened: function (payload) {
    ga('send', 'event', 'Track', "Listened");
  },

  onPlayPreview: function (payload) {
    ga('send', 'event', 'Track', "Previewed");
  },

  onShowPostModal: function (payload) {
    ga('send', 'event', 'New Post', "Show post modal");
  },

  onShowRepostModal: function (payload) {
    ga('send', 'event', 'New Post', "Show repost modal");
  },

  onSelectTrack: function (payload) {
    ga('send', 'event', 'New Post', "Select track");
  },

  onNewPostBack: function (payload) {
    ga('send', 'event', 'New Post', "Go back");
  },

  onSelectVideo: function (payload) {
    ga('send', 'event', 'New Post', "Select alt video");
    ga('send', 'event', 'Track', "Previewed");
  },

  onSavePost: function (payload) {
    ga('send', 'event', 'New Post', "Saved");
  },

  onCloseModal: function (payload) {
    ga('send', 'event', 'New Post', "Close modal");
  },

  onTrackSourceClicked: function (payload) {
    ga('send', 'event', 'Track', 'Clicked track source', payload.location);
  },

  onUpdateBio: function (payload) {
    ga('send', 'event', 'User', 'Update bio');
  },

  onDismissBioCallout: function () {
    ga('send', 'event', 'User', 'Dismiss bio callout');
  },

  onToggleFollow: function (payload, type) {
    var verb = type === 'USER_FOLLOW' ? 'Followed' : 'Unfollowed';
    ga('send', 'event', 'User', verb, payload.location);
  },

  onToggleFavorite: function (payload, type) {
    var verb = type === 'FAVORITE_POST' ? 'Favorited' : 'Unfavorited';
    ga('send', 'event', 'Post', verb, payload.location);
  },

  onCreateComment: function (payload) {
    ga('send', 'event', 'Post', 'Commented');
  },

  onDeleteComment: function (payload) {
    ga('send', 'event', 'Post', 'Deleted comment');
  },

  onExpandComments: function (payload) {
    ga('send', 'event', 'Post', 'Expanded comments');
  }

});