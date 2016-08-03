/** @jsx React.DOM */
var Feed = require('app/components/Feed');
var ViewHelper = require('app/lib/ViewHelpers');

module.exports = React.createFluxClass({

  componentWillMount: function () {
    _.defer(this.getFlux().actions.changePage, 'tag', {tag: this.props.tag});
  },

  render: function () {
    var curUser = this.props.curUser;

    return (
      <div className="container tagged-posts">
        <div className="row">
          <div className="col-xs-12">
            <Feed page='tag' pageOpts={{tag: this.props.tag}} curUser={curUser}  player={this.props.player} />
          </div>
        </div>
      </div>
    );
  }
});