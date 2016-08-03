/** @jsx React.DOM */
var Feed = require('app/components/Feed');

module.exports = React.createFluxClass({

  componentWillMount: function () {
    _.defer(this.getFlux().actions.changePage, 'user', {userId: this.props.user.id});
  },

  render: function () {
    var curUser = this.props.curUser;
    var user = this.props.user;

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <Feed page='user' pageOpts={{userId: user.id}} curUser={curUser} />
          </div>
        </div>
      </div>
    );
  }

});