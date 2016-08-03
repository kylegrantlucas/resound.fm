/** @jsx React.DOM */

module.exports = React.createFluxClass({

  onClick: function () {
    var playState = this.props.playState;
    var isPreview = this.props.isPreview;

    if (isPreview) {
      if (playState < 3) {
        this.getFlux().actions.previewPlayerPlay(this.props.track);  
      } else {
        this.getFlux().actions.previewPlayerPause();  
      }
    } else {
      if (playState < 3) {
        this.getFlux().actions.playerPlay(this.props.postId, 'card');  
      } else {
        this.getFlux().actions.playerPause();  
      }
    }
    
  },

  render: function () {
    var track = this.props.track;
    var playState = this.props.playState;
    

    var cx = React.addons.classSet;
    var classes = cx({
      'play-btn': true,
      'pause': playState === 3,
      'play': playState < 3
    });

    var rootClasses = cx({
      'track-media': true,
      'playing': playState === 3
    });

    return (
      <div className={rootClasses} onClick={this.onClick}>
        <div className="overlay">
          <div className="progress-circle"></div>
          <i className={classes}></i>
        </div>
        <img src={track.icon400}/>
      </div>
    );
  }

});
