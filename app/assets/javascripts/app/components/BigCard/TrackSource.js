/** @jsx React.DOM */
var ViewHelpers = require('app/lib/ViewHelpers');
var TrackHelpers = require('app/helpers/TrackHelpers');

module.exports = React.createFluxClass({

  onClick: function () {
    this.getFlux().actions.clickedTrackSource(this.props.track, 'card');
  },

  buildSourceIcon: function () {
    var track = this.props.track;

    switch(track.provider) {
      case 'youtube':
      case 'itunes':
        return <img src="/assets/YouTube_white.svg" title="YouTube" alt="Track from YouTube"/>;
        break;
      case 'soundcloud':
        return <img src="/assets/Soundcloud_white.svg" title="Soundcloud" alt="Track from Soundcloud"/>;
        break;
    }
  },

  render: function () {
    var track = this.props.track;
    var url = this.props.disabled ? "javascript:void(0)" : TrackHelpers.sourceUrl(track);

    return this.transferPropsTo(
      <a className="track-source" href={url} onClick={this.onClick} target="_blank">
        {this.buildSourceIcon()}
      </a>
    );
  }
});
