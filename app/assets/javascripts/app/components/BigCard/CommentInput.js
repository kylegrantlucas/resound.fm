/** @jsx React.DOM */

var TaggableTextarea = require('app/components/TaggableTextarea');

module.exports = React.createFluxClass({

  post: function (e, value, resetFn) {
    e.preventDefault();

    this.getFlux().actions.postComment(this.props.postId, value);

    resetFn();
  },

  render: function () {
    var curUser = this.props.curUser;

    return (
      <div className="comment-input clearfix">
        <img className="comment-input-user-icon" src={curUser.icon}/>
        <TaggableTextarea autosize placeholder="Post a comment&hellip;" ref='commentText' onPost={this.post}/>
      </div>
    );
  }

});
