/** @jsx React.DOM */
var ViewHelpers = require('app/lib/ViewHelpers');

module.exports = React.createClass({

  // Should be provided ListMenuItem's as children
  render: function () {
    return (
      <ul className="list-menu">
        {this.props.children}
      </ul>
    );
  }
});
