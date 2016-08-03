/** @jsx React.DOM */

var UserList = require('app/components/UserList');
var Spinner = require('app/components/Spinner');

module.exports = React.createFluxClass({

  mixins: [Fluxxor.StoreWatchMixin('FollowingRecs')],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var followingRecsStore = flux.store('FollowingRecs');

    return {
      users: followingRecsStore.getState().recommendations
    };
  },

  render: function () {
    var recommendations = this.state.users;

    return <UserList users={recommendations} curUser={this.props.curUser} />;
  }

});