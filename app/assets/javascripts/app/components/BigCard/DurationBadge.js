/** @jsx React.DOM */

module.exports = React.createFluxClass({
  render: function () {
    var duration = this.props.duration;
    displayDuration = 10 * Math.floor(duration/600)

    return (this.transferPropsTo(
      <p className="duration-badge">
        {displayDuration} min+
      </p>
    ));      
  }
});
