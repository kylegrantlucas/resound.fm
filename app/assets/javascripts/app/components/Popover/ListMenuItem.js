/** @jsx React.DOM */
var Link = require('app/components/Link');

module.exports = React.createClass({

  // Takes one of the following props:
  //  - href (absolute link, ie. to other apps like registration)
  //  - route (internal app links)
  //  - targetAction (either a href link or function)

  handleClick: function (onClickFunction) {
    return function (e) {
      e.preventDefault();
      onClickFunction();
    }
  },

  buildContents: function () {
    if (this.props.href) {
      return (
        <a href={this.props.href}>
          {this.props.children}
        </a>
      );
    } else if (this.props.route) {
      return (
        <Link href={this.props.route}>
          {this.props.children}
        </Link>
      );
    } else if (this.props.clickAction) {
      return (
        <a href="" onClick={this.handleClick(this.props.clickAction)}>
          {this.props.children}
        </a>
      );
    }
  },

  render: function () {
    return this.transferPropsTo(
      <li>
        {this.buildContents()}
      </li>
    );
  }
});
