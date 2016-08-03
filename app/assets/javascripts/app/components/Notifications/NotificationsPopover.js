/** @jsx React.DOM */

var PopoverSet = require('app/components/Popover/PopoverSet');
var NotificationsMenu = require('app/components/Notifications/NotificationsMenu');

module.exports = React.createClass({

  buildPopoverTriggerContent: function () {
    var count = this.props.notifications.unreadCount;
    return (
      <i className="fa fa-bell"><span hidden={count === 0}>{count}</span></i>
    );
  },

  buildPopoverContent: function () {
    return (
      <NotificationsMenu notifications={this.props.notifications}/>
    );
  },

  render: function () {

    var user = this.props.user;

    return <PopoverSet popoverPosition="top" popoverID="nav-notifications-popover" popoverTriggerContent={this.buildPopoverTriggerContent()} popoverContent={this.buildPopoverContent()}/>;
  }

});
