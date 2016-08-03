/** @jsx React.DOM */
var Actions = require('app/actions/Actions');

module.exports = function (component, stores, storesToWatch) {
  var flux = new Fluxxor.Flux(stores, Actions);

  var TestBed = React.createClass({

    mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin.apply(Fluxxor.StoreWatchMixin, storesToWatch)],

    // Testbed specific for UserList test
    getStateFromFlux: function() {
      var users = this.getFlux().store('Followers').getUsers();

      return {
        users: users
      };
    },

    componentDidMount: function () {
      _.defer(this.getFlux().actions.fetchFollowers, 'ryan');
    },

    render: function () {
      return React.addons.cloneWithProps(this.props.children, this.state);
    }
  });
  
  return new TestBed({flux: flux}, component);
}; 
