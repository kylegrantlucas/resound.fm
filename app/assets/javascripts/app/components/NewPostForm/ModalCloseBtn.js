/** @jsx React.DOM */

module.exports = React.createFluxClass({

  close: function (e) {
    e.preventDefault();
    this.getFlux().actions.closeNewPostModal();
  },

  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'modal-close-btn': true,
      'closing': !this.props.modalShown
    });

    return <div className={classes} onClick={this.close} />;
  }

});
