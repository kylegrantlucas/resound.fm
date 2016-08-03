/** @jsx React.DOM */
var GhostButton = require('app/components/Buttons/GhostButton');

module.exports = React.createClass({

  displayName: "PostButton",

  render: function () {
    var text = this.props.brokenTrack ? 'Select another track' : this.props.posting ? 'Posting...' : 'Post';
    var disabled = this.props.posting;

    var stateProps = {
      default: {
        color: 'red',
        text: text,
        filled: true,
      },
      hover: {
        color: 'red',
        text: text,
        filled: true,
      }
    };

    return this.transferPropsTo(<GhostButton className="post-btn" disabled={disabled} stateProps={stateProps}/>);
  }
});