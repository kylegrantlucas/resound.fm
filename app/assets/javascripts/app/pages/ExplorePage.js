/** @jsx React.DOM */

var Feed = require('app/components/Feed');

module.exports = React.createFluxClass({

  componentWillMount: function () {
    _.defer(this.getFlux().actions.changePage, 'explore');
  },

  render: function () {
    var curUser = this.props.curUser;

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <Feed page='explore' curUser={curUser}/>
          </div>
        </div>
      </div>
    );
  }

});
