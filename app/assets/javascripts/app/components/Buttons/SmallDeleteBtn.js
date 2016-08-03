/** @jsx React.DOM */

module.exports = React.createClass({

  render: function () {

    return this.transferPropsTo(
      <a className="small-delete-btn btn btn-default">
        <i className="fa fa-times"></i>
      </a>
    );
  }

});
