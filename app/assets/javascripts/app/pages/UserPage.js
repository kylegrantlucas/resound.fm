/** @jsx React.DOM */

var UserInfoBar = require('app/components/ContextBars/UserInfoBar/UserInfoBar');
var UserPostsPage = require('app/pages/UserPostsPage');
var UserLikedPostsPage = require('app/pages/UserLikedPostsPage');
var UserFollowersPage = require('app/pages/UserFollowersPage');
var UserFollowingsPage = require('app/pages/UserFollowingsPage');
var UserFollowingsPage = require('app/pages/UserFollowingsPage');
var UserInfoFlash = require('app/components/UserInfoFlash');

module.exports = React.createFluxClass({

  mixins: [Fluxxor.StoreWatchMixin('Users')],

  componentDidMount: function () {
    //Todo figure out a better way to load data async
    _.defer(this.getFlux().actions.fetchUser, this.props.userId);
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var store = flux.store('Users');

    return {
      user: store.getUser(this.props.userId)
    };
  },

  render: function () {
    var curUser = this.props.curUser;
    var user = this.state.user;

    if (user) {
      return (
        <div>
          <UserInfoBar user={user} curUser={curUser} />
          <div className="container-fluid">
            <UserInfoFlash user={curUser} curUser={curUser} />
            <div className="row">
              <div className="col-xs-12 loading-wrapper">
                <Locations contextual onBeforeNavigation={this.onChangePage} >
                  <Location path="/" handler={UserPostsPage} user={user} curUser={curUser}/>
                  <Location path="/posts" handler={UserPostsPage} user={user} curUser={curUser}/>
                  <Location path="/liked" handler={UserLikedPostsPage} user={user} curUser={curUser}/>
                  <Location path="/followers" handler={UserFollowersPage} user={user} curUser={curUser}/>
                  <Location path="/following" handler={UserFollowingsPage} user={user} curUser={curUser}/>
                </Locations>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div/>;
    }

  }

});
