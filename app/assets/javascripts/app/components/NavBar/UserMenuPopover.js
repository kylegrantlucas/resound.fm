/** @jsx React.DOM */

var PopoverSet = require('app/components/Popover/PopoverSet');
var ListMenu = require('app/components/Popover/ListMenu');
var ListMenuItem = require('app/components/Popover/ListMenuItem');
var UserHelpers = require('app/helpers/UserHelpers');

module.exports = React.createClass({

  buildPopoverTriggerContent: function (user) {
    return (
      <img src={user.icon}/>
    );
  },

  buildPopoverContent: function (user) {
    return (
      <ListMenu>
        <ListMenuItem route={UserHelpers.profileUrl(user)}>
          <i className="fa fa-user"/><span>View Profile</span>
        </ListMenuItem>
        <ListMenuItem route="/whotofollow">
          <i className="fa fa-users"/><span>Who to follow</span>
        </ListMenuItem>
        <ListMenuItem href="/logout">
          <i className="fa fa-sign-out"/><span>Logout</span>
        </ListMenuItem>
      </ListMenu>
    );
  },

    render: function () {
      return (
        <PopoverSet popoverPosition="top" 
          popoverID="nav-user-menu-popover" 
          popoverTriggerContent={this.buildPopoverTriggerContent(this.props.user)} 
          popoverContent={this.buildPopoverContent(this.props.user)} />
      );
    }
});
