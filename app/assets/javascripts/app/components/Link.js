/**
 * @jsx React.DOM
 */

var React = require('react');

var Link = React.createFluxClass({

  onClick: function(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
    if (!e.defaultPrevented) {
      e.preventDefault();

      if (this.props.type && this.props.location) {
        ga('send', 'event', this.props.type, 'Clicked', this.props.location);
      }

      this.getFlux().actions.navigate(this.props.href);
    }
  },

  render: function() {
    return this.transferPropsTo(React.DOM.a({onClick: this.onClick}, this.props.children));
  }

});

module.exports = Link;