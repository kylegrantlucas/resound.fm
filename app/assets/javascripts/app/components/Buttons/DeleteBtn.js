/** @jsx React.DOM */

module.exports = React.createClass({

  // onDelete: an optional function that will be run after model deletion
  getDefaultProps: function () {
    return {
      onDelete: function () {}
    };
  },

  delete: function (e) {
    e.preventDefault();
    this.props.onDelete(this.props.model);
    if (this.props.model)
      this.props.model.destroy();
  },

  render: function () {
    return this.transferPropsTo(
      <button className="delete-btn btn btn-default" type="button" onClick={this.delete}>
        <i className="fa fa-times"></i>
      </button>
    );
  }

});
