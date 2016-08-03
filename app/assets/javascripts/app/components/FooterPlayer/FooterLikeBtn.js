/** @jsx React.DOM */
var UserHelpers = require('app/helpers/UserHelpers');
var TooltipMixin = require('app/mixins/TooltipMixin');

var USER_LIKES_LIMIT = 15;

module.exports = React.createFluxClass({

  mixins: [TooltipMixin],

  tooltipContent: function() {
    if (this.props.post.favorites.length === 0) {
      return null;
    }

    var users = _.chain(this.props.post.favorites)
      .first(USER_LIKES_LIMIT)
      .map(function (favorite) {
        return <li>{UserHelpers.fullName(favorite.user)}</li>;
      });

    if (this.props.post.likes_count > USER_LIKES_LIMIT) {
      users.push(<li>and {this.props.post.likes_count - USER_LIKES_LIMIT} more...</li>);
    }

    return (
      <ul className='users-tooltip'>
        {users}
      </ul>
    );
  },

  toggleLike: function (e) {
    var post = this.props.post;
    this.getFlux().actions.toggleLikePost(post, 'footer');
  },

  render: function () {
    var post = this.props.post;

    var cx = React.addons.classSet;
    var classes = cx({
      'footer-like-btn': true,
      'fa': true,
      'fa-heart': post.favorited,
      'fa-heart-o': !post.favorited,
      'pull-right': this.props.pullRight
    });

    return <div className={classes} onClick={this.toggleLike}></div>;
  }

});
