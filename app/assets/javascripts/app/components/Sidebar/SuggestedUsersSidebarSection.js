/** @jsx React.DOM */
var ViewHelpers = require('app/lib/ViewHelpers');
var FollowButton = require('app/components/Buttons/FollowButton');
var InviteButton = require('app/components/Buttons/InviteButton');
var SmallDeleteButton = require('app/components/Buttons/SmallDeleteBtn');
var UserHelpers = require('app/helpers/UserHelpers');
var SidebarSection = require('app/components/Sidebar/SidebarSection');
var Link = require('app/components/Link');

var SuggestedUser = React.createFluxClass({

  followUser: function (e) {
    e.preventDefault();
    var user = this.props.user;
    this.getFlux().actions.toggleFollowUser(user, 'suggested-users-sidebar');
  },

  dismissUserSuggestion: function (e) {
    e.preventDefault();
    var user = this.props.user;
    this.getFlux().actions.dismissSuggestedUser(user.id);
  },

  render: function () {

    var user = this.props.user;

    return (
      <li className="suggested-user clearfix">
        <SmallDeleteButton onClick={this.dismissUserSuggestion}/>
        <Link className="user-icon" href={UserHelpers.profileUrl(user)}>
          <img src={user.icon} />
        </Link>
        <Link className="name truncate-with-ellipses" href={UserHelpers.profileUrl(user)}>
          {UserHelpers.fullName(user)}
        </Link>
        <a href="" className="simple-follow-btn" onClick={this.followUser}><i className="fa fa-plus"/>Follow</a>
      </li>
    );
  }
});

var SuggestedUsersList = React.createClass({
  render: function () {
    var suggestedUsers = this.props.suggestedUsers;

    return (
      <ul className="suggested-users">
        {_.map(_.first(suggestedUsers, 5), function (user, i) {
          return <SuggestedUser user={user} key={i} />;
        })}
      </ul>
    );
  }
});

module.exports = React.createFluxClass({

  mixins: [Fluxxor.StoreWatchMixin('FollowingRecs')],

  displayName: "SuggestedUsersSidebarSection",

  getInitialState: function () {
    return {
      page: window.location.pathname,
    };
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var followingRecsStore = flux.store('FollowingRecs');

    return {
      users: followingRecsStore.getState().recommendations
    };
  },

  render: function () {
    return (this.transferPropsTo(
      ViewHelpers.showIfElse((this.state.users.length > 0),
        <SidebarSection headerTitle="Who to follow" headerLink="/whotofollow">
          <SuggestedUsersList suggestedUsers={this.state.users}/>
          <InviteButton/>
        </SidebarSection>,
        <div/>
      )
    ));
  }
});
