module.exports =  {
  contextTypes: {
    flux: React.PropTypes.object
  },

  childContextTypes: {
    flux: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      flux: this.context.flux || this.props.flux
    };
  },

  getFlux: function() {
    return this.context.flux || this.props.flux;
  }
};