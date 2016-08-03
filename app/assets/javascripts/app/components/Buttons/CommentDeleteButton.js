/** @jsx React.DOM */
var SmallDeleteBtn = require('app/components/Buttons/SmallDeleteBtn');

module.exports = React.createFluxClass({

  displayName: "CommentDeleteButton",

  deleteComment: function (e) {
    e.preventDefault();
    var postId = this.props.postId;
    var comment = this.props.comment;
    this.getFlux().actions.deleteComment(postId, comment.id);
  },

  render: function () {
    return <SmallDeleteBtn className='comment-delete-btn' onClick={this.deleteComment}/>;
  }
});
