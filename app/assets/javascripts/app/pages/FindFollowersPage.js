/** @jsx React.DOM */

var UserList = require('app/components/UserList');
var ViewHelpers = require('app/lib/ViewHelpers');
var SimpleButton = require('app/components/Buttons/SimpleButton');

var FindMusicButton = React.createClass({

  onClick: function () {
    window.location = '/feed?onboarding=true';
  },

  render: function () {
    /*var followedUsers = _.where(this.props.users, {following: true});

    if (followedUsers.length < 3) {
      var usersLeft =  3 - followedUsers.length;

      return <SimpleButton color='grey' fullWidth={true} filled={false} text={'Follow ' + usersLeft + ' more people to get started.'}/>;
    } else { */
      return <SimpleButton color='green' fullWidth={true} filled={true} text='Great! Go find music!' onClick={this.onClick}/>;
    //}
  }

});

module.exports = React.createFluxClass({

  buildFollowFacebookFriendsView: function (curUser, users) {
    return (
      <div>
        <div>
          <h1>Who will you follow&#63;</h1>
          <h3>Follow some friends from Facebook or some of these featured users to get started!</h3>
        </div>
        <div id="users-to-follow">
          <UserList users={users} curUser={curUser} userLinksDisabled/>
        </div>
        <div>
          <br/>
          <FindMusicButton users={users} />
        </div>
      </div>
    );
  },

  buildInviteFacebookFriendsView: function (curUser) {
    return (
      <div>
        <h1>Looks like you&apos;re the first of your friends to join Ora!</h1>
        <h3>Finding new music is better with friends. Check out what&apos;s trending to find some people to follow.</h3>
        <br/>
        <a href="/trending" className="btn btn-block btn-danger pull-right">Check out what&apos;s trending</a>
      </div>
    );
  },

  render: function () {
    var curUser = this.props.curUser;
    var users = this.props.users;

    return (ViewHelpers.showIfElse((users.length > 0),
      this.buildFollowFacebookFriendsView(curUser, users),
      this.buildInviteFacebookFriendsView(curUser)
    ));
  }

});