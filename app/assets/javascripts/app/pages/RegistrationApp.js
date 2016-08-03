/** @jsx React.DOM */

var FindFollowersPage = require('app/pages/FindFollowersPage');

module.exports = React.createClass({

  mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin('CurUser', 'Followers')],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var followersStore = flux.store('Followers');
    var curUserStore = flux.store('CurUser');

    return {
      followingRecs: followersStore.getUsers(),
      curUser: curUserStore.getState(),
    };
  },

  render: function () {
    var curUser = this.state.curUser;
    var users = this.state.followingRecs;

    return (
      <div className="fluid-container">
        <div className="row">
          <div className="col-xs-10 col-centered">
            <FindFollowersPage curUser={curUser} users={users}/>
          </div>
        </div>
      </div>
    );
  }

});