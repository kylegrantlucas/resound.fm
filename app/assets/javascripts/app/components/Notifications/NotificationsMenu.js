/** @jsx React.DOM */

var NotificationsList = require('app/components/Notifications/NotificationsList');
var Link = require('app/components/Link');

module.exports = React.createClass({

  render: function () {
    return (
      <div className='notifications-menu'>
        <Link href='/notifications'>
          <h5>Notifications</h5>
        </Link>
        {this.transferPropsTo(<NotificationsList/>)}
      </div>
    );

  }

});