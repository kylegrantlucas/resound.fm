/** @jsx React.DOM */
var SimpleButton = require('app/components/Buttons/SimpleButton');

module.exports = React.createFluxClass({

  displayName: "LikeButton",

  toggleLike: function () {
    var post = this.props.post;
    this.getFlux().actions.toggleLikePost(post, this.props.location);
  },

  render: function () {
    if(this.props.post.favorited) {
      return this.transferPropsTo(
        <SimpleButton color='red' icon='heart' filled={true} text='Liked' hoverText='Unlike' onClick={this.toggleLike}/>
      );
    } else {
      return this.transferPropsTo(
        <SimpleButton color='red' icon='heart' filled={false} text='Like' onClick={this.toggleLike}/>
      );
    }
  }
});
