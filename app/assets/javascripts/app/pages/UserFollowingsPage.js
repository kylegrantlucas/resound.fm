/** @jsx React.DOM */

var UserList = require('app/components/UserList');
var Spinner = require('app/components/Spinner');

module.exports = React.createFluxClass({

  mixins: [Fluxxor.StoreWatchMixin('Followings')],

  componentDidMount: function () {
    //Todo figure out a better way to load data async
    _.defer(this.getFlux().actions.fetchFollowings, this.props.user.id);
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var store = flux.store('Followings');

    return {
      followings: store.getUsers()
    };
  },

  render: function () {
    var followings = this.state.followings;

    if (followings) {
      return <UserList users={followings} curUser={this.props.curUser} />;
    } else {
      return <Spinner/>;
    }
  }

});
