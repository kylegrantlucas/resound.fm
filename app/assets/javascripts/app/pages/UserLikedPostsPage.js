/** @jsx React.DOM */
var Feed = require('app/components/Feed');

module.exports = React.createFluxClass({

  componentWillMount: function () {
    _.defer(this.getFlux().actions.changePage, 'liked', {userId: user.id});
  },

  render: function () {
    var curUser = this.props.curUser;
    var user = this.props.user;

    return <Feed page='liked' pageOpts={{userId: user.id}} curUser={curUser} />;
  }

});
