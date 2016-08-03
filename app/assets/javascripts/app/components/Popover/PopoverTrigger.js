/** @jsx React.DOM */
module.exports = React.createClass({

  render: function () {
    var classes = "popover-link " + this.props.popoverID;
    return this.transferPropsTo(<a className={classes}>{this.props.children}</a>);
  }
});