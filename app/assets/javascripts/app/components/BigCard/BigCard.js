/** @jsx React.DOM */
var TrackMedia = require('app/components/BigCard/TrackMedia');
var TrackInfo = require('app/components/BigCard/TrackInfo');
var PostDescription = require('app/components/BigCard/PostDescription');
var StatsBar = require('app/components/BigCard/StatsBar');
var CommentsBox = require('app/components/BigCard/CommentsBox');
var CommentInput = require('app/components/BigCard/CommentInput');
// var ColorBlock = require('app/components/BigCard/ColorBlock');
var BlurredImage = require('app/components/BlurredImage');
var TrackSource = require('app/components/BigCard/TrackSource');
var ViewHelpers = require('app/lib/ViewHelpers');
var UserHelpers = require('app/helpers/UserHelpers');
var Link = require('app/components/Link');
var TaggableTextarea = require('app/components/TaggableTextarea');

module.exports = React.createFluxClass({

  buildExtraInfo: function (post) {
    // If repost
    var parentPost;
    if (parentPost = post.parent) {
      var userName   = UserHelpers.fullName(parentPost.user);
      var profileUrl = UserHelpers.profileUrl(parentPost.user);

      return (
        <div className="extra-info-bar">
          <p className="truncate-with-ellipses">
            <i className="fa fa-retweet"></i>
            Reposted from <Link href={profileUrl} className="user-name">{userName}</Link>
          </p>
        </div>
      );
    }
  },

  getMessage: function () {
    return this.refs.message.getValue();
  },

  buildBottomHalf: function () {
    var post = this.props.post;
    var user = post.user;
    var comments = post.comments;
    var curUser = this.props.curUser;
    var isPreview = this.props.preview;

    if (isPreview) {
      return (
        <div className="bottom-half">
          <div className="post-description">
            <div className="user-info">
              <div className="user-icon">
                <img src={user.icon}/>
              </div>
              <div className="name-and-time">
                <p className="full-name">{UserHelpers.fullName(user)}</p>
              </div>
            </div>
            <div className="description">
              <TaggableTextarea maxLength={180} autosize placeholder="Let your friends know why you love this track." ref='message'/>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bottom-half">
          <PostDescription post={post} curUser={curUser}/>
          <StatsBar post={post} curUser={curUser}/>
          <CommentsBox commentsCollapsed={this.props.commentsCollapsed} comments={comments} postId={post.id} curUser={curUser}/>
          <CommentInput postId={post.id} comments={comments} curUser={curUser}/>
        </div>
      );
    }
  },

  render: function() {
    var post = this.props.post;
    var user = post.user;
    var track = post.track;
    var comments = post.comments;
    var playState = this.props.playState;

    var isPreview = this.props.preview;

    var cx = React.addons.classSet;
    var classes = cx({
      'big-card': true,
      'cur-post': this.props.isCurPost,
      'card-shadow': true,
    });

    var trendingPos = '';

    if (this.props.trending) {
        trendingPos = <div className='trending-pos' style={{backgroundColor: track.color1}}><p>{this.props.pos}</p></div>;
    }  

    return (
      <div className={classes}>
        {trendingPos}
        <div className="top-half" style={{backgroundColor: track.color1}}>
          {ViewHelpers.showIf(track.broken_track === true,
            <div className="broken-track-error">
              <p><i className="fa fa-frown-o"/>Track currently unavailable</p>
            </div>
          )}
          <BlurredImage src={track.icon200} blurValue={7}/>
          <div className="theBlackness"/>
          {this.buildExtraInfo(post)}
          <TrackInfo track={track}/>
          <TrackMedia track={track} isPreview={isPreview} postId={post.id} playState={playState}/>
          <TrackSource track={track}/>
        </div>
        {this.buildBottomHalf()}
      </div>
    );
  }
});
