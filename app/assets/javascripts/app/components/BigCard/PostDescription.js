/** @jsx React.DOM */
var FollowButton = require('app/components/Buttons/FollowButton');
var TaggedText = require('app/components/TaggedText');
var TimeAgo = require('app/components/TimeAgo');
var FollowButton = require('app/components/Buttons/FollowButton');
var RepostButton = require('app/components/Buttons/RepostButton');
var LikeButton = require('app/components/Buttons/LikeButton');
var UserHelpers = require('app/helpers/UserHelpers');
var Link = require('app/components/Link');

module.exports = React.createFluxClass({

  render: function () {
    var post = this.props.post;
    var user = post.user;
    var curUser = this.props.curUser;
    var profileUrl = UserHelpers.profileUrl(user);
    var fullName = UserHelpers.fullName(user);

    return (
    <div className="post-description">
      <div className="user-info">
        <div className="user-icon">
          <Link href={profileUrl}>
            <img src={user.icon}/>
          </Link>
        </div>
        <div className="name-and-time">
          <Link href={profileUrl}>
            <p className="full-name">{fullName}</p>
          </Link>
          <FollowButton location='description' user={user} curUser={curUser} autoHide />
          <TimeAgo className="time" date={post.created_at} />
        </div>
        <div className="action-buttons">
          <RepostButton post={post}/>
          <LikeButton post={post} location='description'/>
        </div>
      </div>
      <div className="description">
        <p><TaggedText location='description' text={post.message}/></p>
      </div>
    </div>
    );
  }

});
