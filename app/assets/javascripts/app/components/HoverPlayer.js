/** @jsx React.DOM */
var ViewHelpers = require('app/lib/ViewHelpers');
var TrackHelpers = require('app/helpers/TrackHelpers');

module.exports = React.createFluxClass({

  mixins: [Fluxxor.StoreWatchMixin('CurPage', 'PagePosts')],

  componentDidMount: function () {
    if (window.YT && YT.Player) {
      this.buildVideoPlayers();
    } else {
      window.onYouTubeIframeAPIReady = function () {
        this.buildVideoPlayers();
      }.bind(this);
    }
  },

  playerSettings: function (playerId) {
    var flux = this.getFlux();
    var curPostId = this.props.curPostId;

    return {
      height: '275px',
      width: '650px',
      playerVars: {
        autohide: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        wmode: "opaque",
        playsinline: 1,
        cc_load_policy: 0,
        disablekb: 1,
        iv_load_policy: 3,
        enablejsapi: 1,
        origin: window.location.origin,
        html5: ViewHelpers.isFirefox() ? 1 : undefined
      },
      events: {
        onReady: function (e) {
          flux.actions.ytPlayerReady(e.target, playerId);
        },
        onError: function (e) {
          flux.actions.playerLoadError(curPostId, playerId);
        },
        onStateChange: function (e) {
          flux.actions.ytPlayerStateChange(e.data, playerId);
        }
      }
    };
  },

  buildVideoPlayers: function () {
    new YT.Player(this.refs.player1.getDOMNode(), this.playerSettings('player1'));
    new YT.Player(this.refs.player2.getDOMNode(), this.playerSettings('player2'));
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var curPageStore = flux.store('CurPage');
    var pagePostsStore = flux.store('PagePosts');

    return {
      sameContext: _.isEqual(curPageStore.getState(), this.props.playerContext),
      pageLoading: pagePostsStore.getState().loading
    };
  },

  render: function () {
    var styles = {
      display: 'none',
      top: -9999,
      left: -9999
    };

    var video1Style = {
      display: this.props.curPlayerId === 'player1' ? 'block' : 'none'
    };

    var video2Style = {
      display: this.props.curPlayerId === 'player2' ? 'block' : 'none'
    };

    return (
      <div className="hover-player" style={styles}>
        <div ref='player1' className="preview-player yt" style={video1Style} />
        <div ref='player2' className="preview-player yt" style={video2Style} />
      </div>
    ); 
      
  }

});
