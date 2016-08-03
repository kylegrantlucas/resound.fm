/** @jsx React.DOM */

var UserInfoBar = require('app/components/ContextBars/UserInfoBar/UserInfoBar');

module.exports = React.createFluxClass({

  mixins: [Fluxxor.StoreWatchMixin('Users', 'CurPage')],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var store = flux.store('Users');
    var curPageStore = flux.store('CurPage');

    if (curPageStore.context.pageOpts) {
      return {
        user: store.getUser(curPageStore.context.pageOpts.userId)
      };  
    } else {
      return {user: null};
    }
    
  },

  render: function () {
    var curUser = this.props.curUser;
    var user = this.state.user;

    if (user) {
      return <UserInfoBar user={user} curUser={curUser} />;
    } else {
      return <div/>;
    }
  }
});