/** @jsx React.DOM */
var SimpleButton = require('app/components/Buttons/SimpleButton');

module.exports = React.createFluxClass({

  displayName: "FollowButton",

  getInitialState: function () {
    return {
      hidden: (this.props.user.following && this.props.autoHide) || (this.props.curUser && (this.props.curUser.id === this.props.user.id))
    };
  },

  toggleFollow: function () {
    var user = this.props.user;
    this.getFlux().actions.toggleFollowUser(user, this.props.location);
  },

  render: function () {
    var user = this.props.user;
    var filled = (this.props.filled !== undefined) ? this.props.filled : true;

    if (this.state.hidden) {
      return <span/>;
    } else if (user.following) {
      return this.transferPropsTo(
        <SimpleButton className='follow-btn' color='grey' filled={!filled} onClick={this.toggleFollow} text='Following' hoverText='Unfollow'/>
      );
    } else {
      return this.transferPropsTo(
        <SimpleButton className='follow-btn' color='green' icon='plus' filled={filled} onClick={this.toggleFollow} text='Follow'/>
      );
    }
  }
});
