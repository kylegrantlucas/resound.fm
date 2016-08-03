/** @jsx React.DOM */
var PopoverSet = require('app/components/Popover/PopoverSet');
var ListMenu = require('app/components/Popover/ListMenu');
var ListMenuItem = require('app/components/Popover/ListMenuItem');
var ViewHelpers = require('app/lib/ViewHelpers');
var UserHelpers = require('app/helpers/UserHelpers');
var Link = require('app/components/Link');
var TooltipMixin = require('app/mixins/TooltipMixin');

var USER_LIKES_LIMIT = 15;

var LikeSentence = React.createFluxClass({

  toggleLikePost: function (e) {
    e.preventDefault();
    this.getFlux().actions.toggleLikePost(this.props.post, 'like-sentence');
  },

  render: function () {

    var users = this.props.post.favorites.map(function(favorite, i) {
                  return favorite.user;
                });

    var likesCount = this.props.post.likes_count;

    if (users.length > 0) {
      return (
        <span className="like-stats-names">
          <Link className="like-stats-name" href={UserHelpers.profileUrl(users[0])}>{UserHelpers.fullName(users[0])}</Link>
          {ViewHelpers.showIf(users.length > 1,
            <span>&nbsp;and&nbsp;
              <LikesTooltip users={users} likesCount={likesCount}>
                {(users.length - 1) + " " + ViewHelpers.dumbPluralize("other", (users.length-1))}
              </LikesTooltip>
            </span>
          )}
          {ViewHelpers.showIfElse(users.length > 1,
            <span>&nbsp;like this</span>,
            <span>&nbsp;likes this</span>
          )}
        </span>
      );
    } else {
      return(
        <a href="" onClick={this.toggleLikePost}>Be the first person to like this track</a>
      );
    }
  }
});

var LikesTooltip = React.createClass({
  mixins: [TooltipMixin],

  render: function() {
    return (
      <span className="like-stats-others">
        {this.props.children}
      </span>
    );
  },

  tooltipContent: function() {
    var users = _.chain(this.props.users)
      .rest()
      .first(USER_LIKES_LIMIT - 1)
      .map(function (user) {
        return <li>{UserHelpers.fullName(user)}</li>;
      });

    if (this.props.likesCount > USER_LIKES_LIMIT) {
      users.push(<li>and {this.props.likesCount - USER_LIKES_LIMIT} more...</li>);
    }

    return (
      <ul className='users-tooltip'>
        {users}
      </ul>
    );
  }

});

var RepostsTooltip = React.createClass({
  mixins: [TooltipMixin],

  render: function() {
    return this.transferPropsTo(
      <div>
        {this.props.children}
      </div>
    );
  },

  tooltipContent: function() {
    if (this.props.reposts.length === 0) {
      return null;
    } 

    var users = _.chain(this.props.reposts)
      .first(USER_LIKES_LIMIT)
      .map(function (repost) {
        return <li>{UserHelpers.fullName(repost.user)}</li>;
      });

    if (this.props.repostsCount > USER_LIKES_LIMIT) {
      users.push(<li>and {this.props.repostsCount - USER_LIKES_LIMIT} more...</li>);
    }

    return (
      <ul className='users-tooltip'>
        {users}
      </ul>
    );
  }

});

module.exports = React.createFluxClass({

  buildListens: function (post) {
    var listensCount = post.listens_count;
    var listensStr = ViewHelpers.dumbPluralize(" listen", listensCount);

    return (
      <div className="stat-chunk stat-chunk-listens">
        <div className="stat-chunk-content">
          <i className="fa fa-headphones"></i>
          <span className="stat-number">{listensCount}</span>
          <span className="stat-label">{listensStr}</span>
        </div>
      </div>
    );
  },

  buildReposts: function (post) {
    var repostsCount = post.reposts_count;
    var repostStr = ViewHelpers.dumbPluralize(" repost", repostsCount);

    return (
      <div className="stat-chunk stat-chunk-reposts">
        <RepostsTooltip reposts={post.reposts} repostsCount={repostsCount} className="stat-chunk-content">
          <i className="fa fa-retweet"></i>
          <span className="stat-number">{repostsCount}</span>
          <span className="stat-label">{repostStr}</span>
        </RepostsTooltip>
      </div>
    );
  },

  buildLikes: function (post) {
    // TODO: Fancy name logic
    var favoritingUsers = _.pluck(post.favorites, 'user');

    return (
      <div className="stat-chunk stat-chunk-likes">
        <div className="stat-chunk-content">
          <i className="fa fa-heart"></i>
          <LikeSentence post={post}/>
        </div>
      </div>
    );
   },

   buildSettingsChunk: function () {
    return (
      <div className="setting-dots-chunk">
        <i className="fa fa-ellipsis-h"/>
      </div>
    );
   },

   deletePost: function () {
    this.getFlux().actions.deletePost(this.props.post.id);
   },

   buildSettingsMenu: function (post) {
    return (
      <ListMenu>
        {ViewHelpers.showIf(this.props.curUser.id === post.user.id,
          <ListMenuItem className="menu-item-delete" clickAction={this.deletePost}>
            <i className="fa fa-times-circle"/><span>Delete Post</span>
          </ListMenuItem>
        )}
        <ListMenuItem route={"/posts/" + post.id}>
        <i className="fa fa-link "/><span>See Post</span>
        </ListMenuItem>
      </ListMenu>
    );
  },

  render: function () {
    var post = this.props.post;
    var user = post.user;

    var cx = React.addons.classSet;
    var classes = cx({
      'stats-bar': true
    });


    return (
      <div className={classes}>
        <div className="stats">
          {this.buildListens(post)}
          {this.buildReposts(post)}
          {this.buildLikes(post)}
        </div>
        <PopoverSet popoverPosition="top" popoverID={"card-" + post.id + "-settings"} className="settings-popover-set"
          popoverTriggerContent={this.buildSettingsChunk()}
          popoverContent={this.buildSettingsMenu(post)} />
      </div>
    );
  }
});
