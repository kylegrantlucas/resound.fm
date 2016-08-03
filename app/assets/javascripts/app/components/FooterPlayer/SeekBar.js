/** @jsx React.DOM */

module.exports = React.createFluxClass({

  componentWillMount: function() {
    this._setStateFromFlux();
    this.getFlux().store('Player').on("change:pos", this._setStateFromFlux);
  },

  componentWillUnmount: function() {
    this.getFlux().store('Player').removeListener("change:pos", this._setStateFromFlux);
  },

  _setStateFromFlux: function() {
    this.setState({
      player: this.getFlux().store('Player').getState()
    });
  },

  getInitialState: function () {
    return {
      tooltipVisible: false,
      tooltipPos: 0,
      tooltipText: "0:00"
    };
  },

  buildTime: function (pos) {
    pos = pos || 0;
    
    var hours   = Math.floor(pos / 3600);
    var minutes = Math.floor((pos - (hours * 3600)) / 60);
    var seconds = Math.round(pos - (hours * 3600) - (minutes * 60));

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+ seconds;}

    return (hours > 0) ? (hours+':'+minutes+':'+seconds) : (minutes+':'+seconds);
  },

  onMouseUp: function (e) {
    var pos = this.state.player.curPost.pos;
    var duration = this.props.duration;
    var el = $(this.getDOMNode());
    var width = e.pageX - 64;
    var pos = width / el.width() * duration;
    this.getFlux().actions.playerSeek(pos);
  },

  onMouseMove: function (e) {
    var pos = this.state.player.curPost.pos;
    var duration = this.props.duration;
    var el = $(this.getDOMNode());
    var width = e.pageX - 64;
    var pos = width / el.width() * duration;
    var time = this.buildTime(pos);

    this.setState({
      tooltipPos: e.pageX - 72,
      tooltipText: time
    });
  },

  onMouseEnter: function () {
    this.setState({
      tooltipVisible: true
    });
  },

  onMouseLeave: function () {
    this.setState({
      tooltipVisible: false
    });
  },

  render: function () {
    var pos = this.state.player.curPost.pos;
    var duration = this.props.duration;
    var curTime = this.buildTime(pos);
    var durationTime = this.buildTime(duration);

    var style = {
      width: pos / duration * 100 + "%"
    };

    var tooltipStyle = {
      left: this.state.tooltipPos,
      display: this.state.tooltipVisible ? undefined : 'none'
    };

    return (
      <div className="seek-bar-container col-xs-12" onMouseUp={this.onMouseUp} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onMouseMove={this.onMouseMove}>
        <div className='seek-bar'>
          <div className="track-pos">{curTime}</div>
          <div className="track-duration">{durationTime}</div>
          <div className="progress-tooltip" style={tooltipStyle}>
            {this.state.tooltipText}
          </div>
          <div className='progress-bar' style={style}>
            <span className='head'></span>
          </div>
        </div>
      </div>
    );
  }

});
