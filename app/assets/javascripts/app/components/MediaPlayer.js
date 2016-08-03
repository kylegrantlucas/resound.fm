/** @jsx React.DOM */

module.exports = React.createClass({

  getDefaultProps: function() {
    return {
      minimized: false,
      onMinimizePlayer: function(){}
    };
  },

  buildPlayer: function (el) {
    if (window.YT && window.YT.Player) {
        var video = new YT.Player(el, {
          height: '200px',
          width: '200px',
          playerVars: {
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
            onReady:  _.bind(this.ytPlayerReady, this),
            onError: _.bind(this.flux.actions.ytPlayerError, this),
            onStateChange: _.bind(this.flux.actions.ytPlayerStateChange, this)
          }
        });
    } else {
      window.onYouTubeIframeAPIReady = _.bind(function () {
        this.buildPlayer(el);
      }, this);
    }
  },

  componentDidMount: function () {
    this.buildPlayer(this.refs.player.getDOMNode());
  },

  onMinimizePlayer: function (e) {4
    e.preventDefault();
    this.props.onMinimizePlayer();
  },

  render: function () {

    return (
      <div className='video-player' hidden={!this.props.post.isYoutube() || this.props.minimized}>
        <div className='top-bar'>
          <a href='' onClick={this.onMinimizePlayer}>-</a>
        </div>
        <div ref='player' className="yt-player"></div>
      </div>
    );
  }

});
