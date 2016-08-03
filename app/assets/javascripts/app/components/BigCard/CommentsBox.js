/** @jsx React.DOM */
var CommentDeleteButton = require('app/components/Buttons/CommentDeleteButton');
var TaggedText = require('app/components/TaggedText');
var TimeAgo = require('app/components/TimeAgo');
var ViewHelpers = require('app/lib/ViewHelpers');
var UserHelpers = require('app/helpers/UserHelpers');
var Link = require('app/components/Link');

module.exports = React.createFluxClass({

  getInitialState: function () {
    return {
      totalCommentCount: this.props.comments.length,
      visibleCommentCount: this.props.commentsCollapsed ? 0 : 3
    }
  },  

  componentWillReceiveProps: function (nextProps) {
    // Handle addition/deletion of comments
    var commentCountDifference = nextProps.comments.length - this.state.totalCommentCount;
    this.setState({
      totalCommentCount: nextProps.comments.length,
      visibleCommentCount: Math.max(0, this.state.visibleCommentCount + commentCountDifference)
    });
  },

  // Prevent unnecessary re-renders
  // Currently without this function, when a comment is added, every single comment box on the feed re-renders. Why?
  // TODO: Figure out why the above happens
  // TODO: This prevents re-renders necessary to show comment edits/changes where the total count remained the same!
  shouldComponentUpdate: function(nextProps, nextState) {
    return ((this.state.totalCommentCount !== nextState.totalCommentCount) || (this.state.visibleCommentCount !== nextState.visibleCommentCount));
  },

  buildComments: function (comments, curUser) {
    var postId = this.props.postId;
    var sortedComments = _.sortBy(comments, function (c) {
        return new Date(c.created_at).getTime();
    });

    if (this.state.visibleCommentCount === 0) {
      return [];
    } else {
      sortedComments = _.last(sortedComments, this.state.visibleCommentCount);
    }

    return _.map(sortedComments, function (comment) {
      var user = comment.user;

      return (
        <li className="comment" key={comment.id}>
          <a className="user-icon" href={UserHelpers.profileUrl(user)}>
            <img src={user.icon} />
          </a>
          <div className="comment-body">
            <Link className="user-full-name" href={UserHelpers.profileUrl(user)}>
              {UserHelpers.fullName(user)}
            </Link>
            {ViewHelpers.showIf(user.id === curUser.id,
              <CommentDeleteButton comment={comment} postId={postId}/>)}
            <p className="comment-time"><TimeAgo date={comment.created_at} /></p>
            <div className="comment-text">
              <TaggedText location='comment' text={comment.message}/>
            </div>
          </div>
        </li>
      );
    });
  },

  buildMoreCommentsButton: function() {
    // This function either returns a button that says 'n comments' (if collapsed) or 'n more comments'

    var visibleCommentCount = this.state.visibleCommentCount;
    var totalCommentCount = this.props.comments.length;
    var hiddenCommentCount = Math.max(0, totalCommentCount - visibleCommentCount);
    var buttonText, commentWord = ViewHelpers.dumbPluralize("comment", hiddenCommentCount);

    if (visibleCommentCount < totalCommentCount) {
      if (visibleCommentCount === 0) {
        buttonText = hiddenCommentCount + " " + commentWord;
      } else {
        buttonText = hiddenCommentCount + " more " + commentWord;
      }

      return (
        <div className="more-comments">
          <a href="" onClick={this.showMoreComments} className="more-comments-btn">{buttonText}</a>
        </div>
      );
    } else {
      return null;
    }
  },

  showMoreComments: function (e) {

    var commentIncrement = 8;

    e.preventDefault();
    this.setState({
      visibleCommentCount: Math.min(this.state.visibleCommentCount + commentIncrement)
    });

    _.defer(this.getFlux().actions.expandComments);
  },

  render: function () {
    var comments = this.props.comments;
    var curUser  = this.props.curUser;

    var commentViews = this.buildComments(comments, curUser);

    return (
      <div>
        {ViewHelpers.showIf(comments.length > 0,
          <div className="comments-box">
            {this.buildMoreCommentsButton()}
            <ul className="comments">
              {commentViews}
            </ul>
          </div>
        )}
      </div>
    );
  }
});
