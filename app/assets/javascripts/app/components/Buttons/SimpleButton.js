/** @jsx React.DOM */
var GhostButton = require('app/components/Buttons/GhostButton');

module.exports = React.createClass({

  /* SimpleButton takes the following
      - href or onClick
      - stateProps
        - color
        - filled (default state is filled or unfilled, hover is the opposite)
        - text (with no text prop provided, children will be used)
        - hoverText (alternate text on hover, will default to 'text' if not provided)
        - icon
  */

  render: function () {

    var filled = this.props.filled !== undefined ? this.props.filled : true;

    var stateProps = {
      default: {
        color: this.props.color,
        text: this.props.text,
        filled: filled,
        icon: this.props.icon,
      },
      hover: {
        color: this.props.color,
        text: this.props.hoverText || this.props.text,
        filled: !filled,
        icon: this.props.icon,
      }
    };

    return this.transferPropsTo(
      <GhostButton stateProps={stateProps}>
        {this.props.children}
      </GhostButton>
    );
  }
});
