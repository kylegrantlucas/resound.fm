/** @jsx React.DOM */

var DurationBadge = require('app/components/BigCard/DurationBadge');

module.exports = React.createFluxClass({
  buildDurationBadge: function (duration, threshold) {
    if(duration >= threshold) {
      return <DurationBadge duration={duration}/>
    } else {
      return null;
    }
  },

  render: function () {
    var track = this.props.track;

    return (
      <div className="track-info">
        <h2 className="title">{track.name}</h2>
        <h3 className="artist truncate-with-ellipses">{track.artist}</h3>
        {this.buildDurationBadge(track.duration, 600)}
      </div>
    );
  }
});
