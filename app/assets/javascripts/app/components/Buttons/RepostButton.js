/** @jsx React.DOM */
var SimpleButton = require('app/components/Buttons/SimpleButton');

module.exports = React.createFluxClass({

  displayName: "RepostButton",

  onClick: function () {
    this.getFlux().actions.showRepostModal(this.props.post);
  },

  render: function () {
    if(this.props.post.reposted_by_current_user) {
      return this.transferPropsTo(
        <SimpleButton disabled color='blue' icon='retweet' filled={true} text='Reposted'/>
      );
    } else {
      return (
        <SimpleButton color='blue' icon='retweet' filled={false} text='Repost' onClick={this.onClick}/>
      );
    }
  }
});
