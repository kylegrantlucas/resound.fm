/** @jsx React.DOM */
var BigCard = require('app/components/BigCard/BigCard');
var Spinner = require('app/components/Spinner');
var InfiniteScroll = require('app/components/InfiniteScroll');
var ViewHelpers = require('app/lib/ViewHelpers');

module.exports = React.createFluxClass({

  mixins: [Fluxxor.StoreWatchMixin('CurPage', 'PagePosts', 'Player')],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var store = flux.store('PagePosts');
    var playerStore = flux.store('Player');
    var curPageStore = flux.store('CurPage');
    var posts = store.getPosts(this.props.page);

    if (_.isEqual(curPageStore.context, playerStore.curPost.context)) {
      var idx = playerStore.curPost.idx;
    }

    return {
      playerContext: playerStore.curPost.context,
      posts: posts,
      hasMore: store.hasMorePosts,
      playState: playerStore.curPost.playState,
      loading: store.getState().loading,
      focusPostId: store.focusPostId,
      curPostId: playerStore.curPost.id,
      curPostIdx: idx 
    };
  },

  componentDidUpdate: function () {
    if (this.isMounted() && this.state.focusPostId && this.refs.infiniscroll.getDOMNode()) {
      var idx = this.state.curPostIdx;
      var el = this.refs.infiniscroll.getDOMNode().children[idx];

      if (el) {
        $(window).scrollTop($(el).position().top);

        _.defer(this.getFlux().actions.onScrollToPost);  
      }
    }
  },

  fetchPosts: function () {
    // TODO: figure out a better way to load data async
    _.defer(this.getFlux().actions.fetchPosts);
  },

  // trackCurPost: function () {
  //   if (_.isNumber(this.state.curPostIdx) && this.refs.infiniscroll) {
  //     var el = this.refs.infiniscroll.getDOMNode().children[this.state.curPostIdx];
  //     var coords = ViewHelpers.getOffsetRect(el);

  //     _.defer(this.getFlux().actions.curPostPosChanged, coords);
  //   }
  // },
  
  render: function () {
    var self = this;
    var posts = this.state.posts;
    var curUser = this.props.curUser;
    var isTrending = this.props.context.page === 'trending';
    var commentsCollapsed = isTrending;

    if (!this.state.loading) {
      if (posts.length > 0) {
        var postViews = _.map(posts, function (post, i) {
          var playState = 0;
          var isCurPost = false;

          if (this.state.curPostIdx === i) {
            playState = this.state.playState;
            isCurPost = true;
          }

          return <BigCard isCurPost={isCurPost} commentsCollapsed={commentsCollapsed} trending={isTrending} playState={playState} post={post} curUser={curUser} queue={posts} pos={i + 1} key={post.id} />
        }, this);

        return (
          <div className='feed'>
            <InfiniteScroll threshold={250} loadMore={this.fetchPosts} hasMore={this.state.hasMore} ref='infiniscroll'>
              {postViews}
            </InfiniteScroll>
          </div>
        );
      } else {
        return (
          <div className='feed'>
            <div className='no-posts'>
              <h1>No Posts</h1>
            </div>
          </div>
        );
      }
      
    } else {
      return (
        <div className='feed'>
          <Spinner className='content-spinner' />
        </div>
      );
    }
  }

});
