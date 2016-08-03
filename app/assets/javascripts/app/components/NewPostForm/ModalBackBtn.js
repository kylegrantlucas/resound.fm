/** @jsx React.DOM */

module.exports = React.createFluxClass({

  back: function (e) {
    e.preventDefault();
    this.getFlux().actions.newPostGoBack();
  },

  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'modal-back-btn': true
    });

    return (
      <div className={classes} onClick={this.back}>
        <div className='back-arrow'/>
        {this.props.label}
      </div>
    );
  }

});
