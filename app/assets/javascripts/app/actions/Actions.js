module.exports = {

  fetchPosts: function () {
    this.dispatch("POSTS_FETCH", {});
  },

  fetchPost: function (postId) {
    this.dispatch("POST_FETCH", {page: 'post', pageOpts: {postId: postId}});
  },

  addPost: function (post, context) {
    this.dispatch('POSTS_ADD', {posts: [post], context: context});
  },

  addPosts: function (posts, context) {
    this.dispatch('POSTS_ADD', {posts: posts, context: context});
  },

  deletePost: function (postId) {
    this.dispatch('POST_DELETE', {postId: postId});
  },

  fetchUser: function (userIdOrName) {
    this.dispatch('USER_FETCH', {userId: userIdOrName});
  },

  addUser: function (user) {
    this.dispatch('USER_ADD', {user: user});
  },

  fetchFollowers: function (userIdOrName) {
    this.dispatch('FOLLOWERS_FETCH', {userId: userIdOrName});
  },

  addFollowers: function (followers) {
    this.dispatch('FOLLOWERS_ADD', {followers: followers});
  },

  fetchFollowings: function (userIdOrName) {
    this.dispatch('FOLLOWINGS_FETCH', {userId: userIdOrName});
  },

  addFollowings: function (followings) {
    this.dispatch('FOLLOWINGS_ADD', {followings: followings});
  },

  toggleFollowUser: function (user, location) {
    if (user.following) {
      this.dispatch('USER_UNFOLLOW', {userId: user.id, location: location});
    } else {
      this.dispatch('USER_FOLLOW', {userId: user.id, location: location});
    }
  },

  followUser: function (userId) {
    this.dispatch('USER_FOLLOW', {userId: userId});
  },

  unfollowUser: function (userId) {
    this.dispatch('USER_UNFOLLOW', {userId: userId});
  },

  dismissSuggestedUser: function (userId) {
    this.dispatch('USER_REC_DISMISS', {userId: userId});
  },

  toggleLikePost: function (post, location) {
    if (post.favorited) {
      this.dispatch('UNFAVORITE_POST', {postId: post.id, location: location});
    } else {
      this.dispatch('FAVORITE_POST', {postId: post.id, location: location});
    }
  },

  likePost: function (postId) {
    this.dispatch('FAVORITE_POST', {postId: postId});
  },

  unlikePost: function (postId) {
    this.dispatch('UNFAVORITE_POST', {postId: postId});
  },

  postComment: function (postId, message) {
    this.dispatch("COMMENT_CREATE", {postId: postId, message: message});
  },

  postCommentSuccess: function (comment, postId, tempId) {
    this.dispatch("COMMENT_CREATE_SUCCESS", {comment: comment, postId: postId, tempId: tempId});
  },

  deleteComment: function (postId, commentId) {
    this.dispatch("COMMENT_DELETE", {postId: postId, commentId: commentId});
  },

  fetchComments: function (postId) {
    this.dispatch("COMMENTS_FETCH", {postId: postId});
  },

  listenedToPost: function (postId) {
    this.dispatch("LISTEN_POST", {postId: postId});
  },

  showPostModal: function () {
    this.dispatch("NEW_POST_SHOW_POST_MODAL", {});
  },

  showRepostModal: function (repost) {
    this.dispatch("NEW_POST_SHOW_REPOST_MODAL", {repost: repost});
  },

  searchNewPostTracks: function (query) {
    this.dispatch('NEW_POST_SEARCH_TRACKS', {query: query});
  },

  selectNewPostTrack: function (track) {
    this.dispatch('NEW_POST_SELECT_TRACK', {track: track});
  },

  newPostGoBack: function () {
    this.dispatch("NEW_POST_GO_BACK", {});
  },

  selectNewPostVideo: function (video) {
    this.dispatch('NEW_POST_SELECT_VIDEO', {video: video});
  },

  saveNewPost: function(message) {
    this.dispatch('NEW_POST_SAVE', {message: message});
  },

  saveNewPostSuccess:function (post) {
    this.dispatch('NEW_POST_SAVE_SUCCESS', {post: post});  
  },

  playerReadyAfterPost: function () {
    this.dispatch('NEW_POST_PLAYER_READY', {});  
  },

  matchNewPostSuccess: function (track) {
    this.dispatch('NEW_POST_MATCH_TRACK_SUCCESS', {track: track});
  },

  closeNewPostModal: function () {
    this.dispatch("NEW_POST_CLOSE_MODAL", {});
  },  

  fetchNotifications: function () {
    this.dispatch("NOTIFICATIONS_FETCH", {});
  },

  addNotifications: function (notifications) {
    this.dispatch("NOTIFICATIONS_ADD", {notifications: notifications});
  },

  notificationsMarkRead: function () {
    this.dispatch("NOTIFICATIONS_MARK_READ", {});
  },

  curPostPosChanged: function (pos) {
    this.dispatch('PLAYER_POSITION_CHANGE', {pos: pos});
  },

  expandComments: function () {
    this.dispatch('POST_EXPAND_COMMENTS', {});
  },

  ytPlayerReady: function (video, playerId) {
    this.dispatch('YT_PLAYER_READY', {video: video, playerId: playerId});
  },

  ytPlayerStateChange: function (playState, playerId) {
    this.dispatch('YT_PLAYER_STATE_CHANGE', {playState: playState, playerId: playerId});
  },

  playerLoadError: function (postId, playerId) {
    this.dispatch('PLAYER_ERROR', {postId: postId, playerId: playerId});
  },

  playerPlay: function (postId, location) {
    this.dispatch('PLAYER_PLAY', {
      postId: postId,
      location: location
    });
  },

  previewPlayerPlay: function (track) {
    this.dispatch('PLAYER_PLAY_PREVIEW', { track: track });
  },

  playerPause: function () {
    this.dispatch('PLAYER_PAUSE', {});
  },

  previewPlayerPause: function () {
    this.dispatch('PLAYER_PAUSE_PREVIEW', {});
  },

  playerNext: function (finishedSong) {
    this.dispatch('PLAYER_NEXT', {
      finishedSong: finishedSong
    });
  },
  
  playerPrev: function () {
    this.dispatch('PLAYER_PREV');
  },

  playerSeek: function (pos) {
    this.dispatch('PLAYER_SEEK', {
      pos: pos
    });   
  },

  previewPlayerSeek: function (pos) {
    this.dispatch('PREVIEW_PLAYER_SEEK', {
      pos: pos
    });
  },

  changePage: function (page, pageOpts) {
    this.dispatch('PAGE_CHANGE', { page: page, pageOpts: pageOpts });
  },

  playerTogglePlayCard: function (postId) {
    this.dispatch('PLAYER_TOGGLE_PLAY',{
      postId: postId,
      source: 'card'
    });
  },

  previewCardShow: function (pos) {
    this.dispatch('NEW_POST_PLAYER_SHOW', { pos: pos });
  },

  previewCardHide: function () {
    this.dispatch('NEW_POST_PLAYER_HIDE', {});
  },

  previewCardChangePos: function (pos) {
    this.dispatch('NEW_POST_PLAYER_POSITION_CHANGE', { pos: pos });
  },

  navigate: function (href, opts) {
    var payload = _.extend({href: href}, opts);
    this.dispatch('NAVIGATE', payload);
  },

  goToCurPost: function () {
    this.dispatch('PLAYER_GO_TO_POST', {});
  },

  onScrollToPost: function () {
    this.dispatch('PLAYER_GO_TO_POST_SUCCESS', {});
  },

  updateBio: function (bio) {
    this.dispatch('CUR_USER_UPDATE_BIO', {bio: bio});
  },

  dismissBioCallout: function () {
    this.dispatch('CUR_USER_DISMISS_BIO_CALLOUT', {});
  },

  clickedTrackSource: function (track, location) {
    this.dispatch('TRACK_SOURCE_CLICKED', {track: track, location: location});
  }

};