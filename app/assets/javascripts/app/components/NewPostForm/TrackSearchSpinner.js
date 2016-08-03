/** @jsx React.DOM */
var Spinner = require('app/components/Spinner');

module.exports = React.createClass({

  spinnerOptions: {
    lines: 9, // The number of lines to draw
    length: 10, // The length of each line
    width: 5, // The line thickness
    radius: 8, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#fff', // #rgb or #rrggbb or array of colors
    speed: 2, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '100%' // Left position relative to parent
  },

  render: function () {
    return this.transferPropsTo(<Spinner spinnerOptions={this.spinnerOptions}/>);
  }

});
