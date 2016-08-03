/** @jsx React.DOM */

module.exports = React.createFluxClass({

  mixins: [Fluxxor.StoreWatchMixin('Player', 'CurPage', 'PagePosts', 'NewPost')],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var player = flux.store('Player');
    var curPage = flux.store('CurPage');
    var pagePosts = flux.store('PagePosts');
    var newPostStore = flux.store('NewPost');
    var posts = pagePosts.getPosts();

    if (_.isEqual(curPage.context, player.curPost.context)) {
      var idx = _.findIndex(posts, { 'id': player.curPost.id });
    }

    return {
      player: player.getState(),
      curPost: pagePosts.getPost(player.curPost.id),
      newPostStore: newPostStore.getState(),
      curPage: curPage.getState(),
      posts: pagePosts.getPosts()
    };
  },

  componentWillMount: function() {
    this._setPos();
    this.getFlux().store('Player').on("change:pos", this._setPos);
  },

  componentWillUnmount: function() {
    this.getFlux().store('Player').removeListener("change:pos", this._setPos);
  },

  _setPos: function() {
    this.setState({
      player: this.getFlux().store('Player').getState()
    });
  },

  playStateToString: function (playState) {
    switch(playState) {
      case 0:
        return 'STOPPED';
      case 1:
        return 'LOADING';
      case 2:
        return 'PAUSED';
      case 3:
        return 'PLAYING';
    }
  },
  
  render: function () {
    var player = this.state.player;
    var curPost = player.curPost;
    var preview = player.preview;
    var curPostModel = this.state.curPost;
    var newPostStore = this.state.newPostStore;
    var curPage = this.state.curPage;
    var postIds = _.chain(this.state.posts).first(5).pluck('id').value();

    return (
      <div className='test-module card-shadow'>
        <ul>
          <li><h3>Player:</h3></li>
          <li>previewing: {player.previewing ? 'true' : 'false'}</li>
          <li><h4>curPost:</h4></li>
          <li>id: {curPost.id}</li>
          <li>name: {curPostModel ? curPostModel.track.name : 'no post found'}</li>
          <li>playState: {this.playStateToString(curPost.playState)}</li>
          <li>pos: {curPost.pos}</li>
          <li>idx: {curPost.idx}</li>
          <li>context: {JSON.stringify(curPost.context)}</li>
          <li><h4>preview:</h4></li>
          <li>name: {preview && preview.track ? preview.track.name : 'no preview track'}</li>
          <li>pos: {preview.pos}</li>
          <li>playState: {this.playStateToString(preview.playState)}</li>
          <li><h3>NewPost</h3></li>
          <li>modalShown: {newPostStore.modalShown ? 'true' : 'false'}</li>
          <li>newPost: {newPostStore.newPost ? 'something' : 'nothing'}</li>
          <li>posting: {newPostStore.posting ? 'true' : 'false'}</li>
          <li>matching: {newPostStore.matching ? 'true' : 'false'}</li>
          <li>repost: {newPostStore.repost ? 'true' : 'false'}</li>
          <li>page: {newPostStore.page}</li>
          <li><h3>CurPage:</h3></li>
          <li>context: {JSON.stringify(curPage)}</li>
          <li><h3>Posts</h3></li>
          <li>postId: {JSON.stringify(postIds)}</li>
        </ul>
      </div>
    );
  }

});
