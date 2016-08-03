/** @jsx React.DOM */

var SimpleButton = require('app/components/Buttons/SimpleButton');
var FollowButton = require('app/components/Buttons/FollowButton');
var UserHelpers = require('app/helpers/UserHelpers');
var ViewHelpers = require('app/lib/ViewHelpers');
var Link = require('app/components/Link');

module.exports = React.createFluxClass({

  followAllFunction: function (users) {
    return function () {
      _.forEach(users, function (user) {
        this.getFlux().actions.toggleFollowUser(user);
      })
    }
  },

  buildFollowAllButton: function (users) {
    return (
      <li className='follow-all-btn-container'>
        <SimpleButton color='green' filled={false} text='Follow All' onClick={this.followAllFunction(users)} fullWidth={true}/>
      </li>
    );
  },

  buildUserImage: function (user) {
    if(!this.props.userLinksDisabled) {
      return (
        <Link className='user-image-container' href={UserHelpers.profileUrl(user)}>
          <img className='user-image' src={user.icon}/>
        </Link>
      );
    } else {
      return (
        <div className='user-image-container no-link'>
          <img className='user-image' src={user.icon}/>
        </div>
      );
    }
  },

  buildUserName: function (user) {
    if(!this.props.userLinksDisabled) {
      return (
        <Link className='user-name-container' href={UserHelpers.profileUrl(user)}>
          <h4 className='user-name truncate-with-ellipses'>{UserHelpers.fullName(user)}</h4>
        </Link>
      );
    } else {
      return (
        <div className='user-name-container no-link'>
          <h4 className='user-name truncate-with-ellipses'>{UserHelpers.fullName(user)}</h4>
        </div>
      );
    }
  },

  render: function () {
    var users = this.props.users;

    if (users && users.length > 0) {
      var userViews = users.map(function (user) {

        var followButton = null;
        if (this.props.curUser.id !== user.id) {
            followButton = <FollowButton location='user-list' user={user} />;
        }

        // Note: Floats are smelly. Don't move the follow button.
        return (
          <li className='user-list-row'>
            {this.buildUserImage(user)}
            {followButton}
            <div className='user-info'>
              <div className='top-half'>
                {this.buildUserName(user)}
                <p className='followers-info'>
                  {ViewHelpers.showIfElse((user.followers_count > 0),
                    user.followers_count + " FOLLOWERS",
                    ""
                  )}
                </p>
              </div>
              <div className='bottom-half'>
                <p className='truncate-with-ellipses'>{user.bio}</p>
              </div>
            </div>
          </li>
        );
      }, this);

      return (
        <ul className='user-list media-list'>
          {ViewHelpers.showIf(this.props.followAllButton,
            this.buildFollowAllButton(users)
          )}
          {userViews}
        </ul>
      );
    } else {
      return (
        <ul className='user-list media-list'>
          <div className='no-users'>
            <h1>No Users</h1>
          </div>
        </ul>
      );
    }
  }
});
