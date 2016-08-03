/** @jsx React.DOM */

var NotificationsList = require('app/components/Notifications/NotificationsList');
var Spinner = require('app/components/Spinner');
module.exports = React.createFluxClass({

  componentWillMount: function () {
    _.defer(this.getFlux().actions.setPage, 'notifications');
  },

  render: function () {
    var notifications = this.props.notifications;
    var curUser = this.props.curUser;

    return (
      <div className="container notifications-page">
        <NotificationsList infiniteScroll curUser={curUser} notifications={notifications} visible={true} />
      </div>
    );

  }

});