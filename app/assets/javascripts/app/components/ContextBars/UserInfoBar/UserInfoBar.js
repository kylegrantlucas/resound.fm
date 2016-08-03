/** @jsx React.DOM */

var FollowButton = require('app/components/Buttons/FollowButton');
var UserBio = require('app/components/ContextBars/UserInfoBar/UserBio');
var UserHelpers = require('app/helpers/UserHelpers');
var Link = require('app/components/Link');

module.exports = React.createClass({

  activePage: function () {
    var matched = _.some(arguments, function (page) {
      var activePage = window.location.pathname.split(UserHelpers.UserUrlRegex)[1] || '/';
      if (page === '/') {
        return page === activePage;
      }

      return activePage.indexOf(page) === 0;
    }, this);

    return matched ? 'active' : '';
  },

  buildFollowButton: function () {
    var user = this.props.user;
    var curUser = this.props.curUser;

    if (user.id !== curUser.id) {
      return <FollowButton location='user-info-bar' user={user} />;
    }

    return '';
  },

  render: function () {
    var user = this.props.user;
    var curUser = this.props.curUser;

    return (
      <div className='user-info-bar'>
        <div className='container'>
          <div className='row'>
            <div className="col-xs-12">
              <div className='user-icon-container'>
                <img src={user.icon200}/>
              </div>
              <div className='user-info-top-half'>
                <div className='user-name-desc-container'>
                  <h2 className="truncate-with-ellipses">{UserHelpers.fullName(user)}</h2>
                  {this.buildFollowButton()}
                </div>
              </div>
              <div className="user-info-bottom-half clearfix">
                <UserBio curUser={curUser} user={user}/>
                <div className="btn-group btn-group-lg">
                  <Link href={UserHelpers.profileUrl(user)} type="button" className={"btn btn-default " + this.activePage('/')}>
                    <span className="btn-count"><strong>{user.posts_count}</strong></span>
                    <span className="btn-label">Posts</span>
                  </Link>
                  <Link href={UserHelpers.likedUrl(user)} type="button" className={"btn btn-default " + this.activePage('/liked')}>
                    <span className="btn-count"><strong>{user.likes_count}</strong></span>
                    <span className="btn-label">Likes</span>
                  </Link>
                  <Link href={UserHelpers.followersUrl(user)} type="button" className={"btn btn-default " + this.activePage('/followers')}>
                    <span className="btn-count"><strong>{user.followers_count}</strong></span>
                    <span className="btn-label">Followers</span>
                  </Link>
                  <Link href={UserHelpers.followingUrl(user)} type="button" className={"btn btn-default " + this.activePage('/following')}>
                    <span className="btn-count"><strong>{user.following_count}</strong></span>
                    <span className="btn-label">Following</span>
                  </Link>
                </div>
              </div>            
            </div>
          </div>
        </div>
      </div>
    );
  }
});
