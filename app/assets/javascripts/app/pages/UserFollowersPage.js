/** @jsx React.DOM */

var UserList = require('app/components/UserList');
var Spinner = require('app/components/Spinner');

module.exports = React.createFluxClass({

  mixins: [Fluxxor.StoreWatchMixin('Followers')],

  componentDidMount: function () {
    //Todo figure out a better way to load data async
    _.defer(this.getFlux().actions.fetchFollowers, this.props.user.id);
  },

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var store = flux.store('Followers');

    return {
      followers: store.getUsers()
    };
  },

  render: function () {
    var followers = this.state.followers;

    if (followers) {
      return <UserList users={followers} curUser={this.props.curUser} />;
    } else {
      return <Spinner/>;
    }
  }

});
