/** @jsx React.DOM */

module.exports = React.createFluxClass({

  previous: function (e) {
    e.preventDefault();
    this.getFlux().actions.playerPrev();
  },

  togglePlay: function (e) {
    e.preventDefault();

    var playState = this.props.playState;

    if (playState < 3) {
      this.getFlux().actions.playerPlay(this.props.postId, 'footer');  
    } else {
      this.getFlux().actions.playerPause();  
    }
    
  },

  next: function (e) {
    e.preventDefault();
    this.getFlux().actions.playerNext();
  },

  render: function () {
    var playState = this.props.playState;

    var cx = React.addons.classSet;
    var classes = cx({
      'play-btn': true,
      'fa': true,
      'fa-pause': playState === 3,
      'fa-play': playState < 3
    });

    return (
      <div className="media-controls">
        <i onClick={this.previous} className="fa fa-fast-backward back-btn"></i>
        <i onClick={this.togglePlay} className={classes}></i>
        <i onClick={this.next} className="fa fa-fast-forward next-btn"></i>
      </div>
    );
  }

});
