/** @jsx React.DOM */

var Spinner = require('app/components/Spinner');
var InfiniteScroll = require('app/components/InfiniteScroll');
var ViewHelpers = require('app/lib/ViewHelpers');
var Link = require('app/components/Link');

var NotificationItem = React.createClass({
  render: function () {
    var notification = this.props.notification;

    return (
      <li>
        <Link href={notification.target_url}>
          <img src={notification.icon} />
          <p>{notification.text}</p>
          <div className="time">{moment(new Date(notification.created_at)).fromNow()}</div>
        </Link>
      </li>
      );
  }
});

var SeeMoreLink = React.createClass({
  render: function () {

    return (
      <li className='see-more'>
        <Link href='/notifications'>
          See All
        </Link>
      </li>
    );
  }
});

module.exports = React.createFluxClass({

  getInitialState: function () {
    return {
      loaded: false
    };
  },

  componentWillMount: function () {
    _.defer(this.getFlux().actions.fetchNotifications);
  },

  componentDidUpdate: function (prevProps, prevState) {

    if (!prevProps.visible && this.props.visible && !this.props.infiniteScroll) {
      ga('send', 'event', 'Notifications', 'Opened tray');
    }

    // When the Notification List becomes visible clear the unread count
    if (this.props.visible && this.props.notifications.unreadCount > 0) {
      _.defer(this.getFlux().actions.notificationsMarkRead);
    }

    if (!this.props.notifications.loading && !prevState.loaded) {
      this.setState({
        loaded: true
      })
    }
  },

  loadMore: function (page) {
    if (this.props.notifications.hasMore && this.props.visible) {
      _.defer(this.getFlux().actions.fetchNotifications);  
    }
  },

  buildNotifications: function () {
    var notifications = this.props.notifications.items;
    var loading = this.props.notifications.loading;

    if (notifications.length > 0) {
      return notifications.map(function (n) {
        return <NotificationItem notification={n} key={n.cid}/>;
      });
    } else if (loading) {
      return <Spinner />;
    } else {
      return <div className='no-notifications'>No notifications.</div>
    }
  },

  render: function () {
    var hasMore = !this.props.infiniteScroll && !this.state.loaded 
                    || this.props.infiniteScroll && this.props.notifications.hasMore;

    // TODO: figure out the threshold on this list so it doesn't load all of them.
    return (
      <div className='notifications-list'>
        <InfiniteScroll threshold={window.screen.availHeight * 2 || 1024} loadMore={this.loadMore} hasMore={hasMore}>
          {this.buildNotifications()}
        </InfiniteScroll>
        {ViewHelpers.showIf(!hasMore && !this.props.infiniteScroll,
          <SeeMoreLink/>
        )}
      </div>
    );
  }

});
