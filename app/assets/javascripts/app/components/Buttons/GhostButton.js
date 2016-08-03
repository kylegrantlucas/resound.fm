/** @jsx React.DOM */
var ViewHelpers = require('app/lib/ViewHelpers');

module.exports = React.createClass({

// Props
// - href or onClick
// - fullWidth
// - disabled
// 
// States Schema
//  states: {
//    default: {
//      text: "",
//      color: "",
//      filled: false,
//      icon: "",
//    },
//    hover: {
//      text: "",
//      color: "",
//      filled: true,
//      icon: "",
//    }
//  }

// State Related Functions
// ----------------------------------------------------------------------------
  getInitialState: function () {
    return {
      hover: false,
      disabled: this.props.disabled
    }
  },

  onMouseOver: function (e) {
    if(!this.props.disabled) {
      this.setState({
        hover: true
      });
    }
  },

  onMouseOut: function (e) {
    this.setState({
      hover: false
    });
  },

  getCurStateProps: function () {
    if (this.state.hover) {
      return this.props.stateProps['hover'] || this.props.stateProps['default'] || [];
    } else {
      return this.props.stateProps['default'] || [];
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      disabled: nextProps.disabled
    });
  },

// Support Functions
// ----------------------------------------------------------------------------
  buildIcon: function (icon) {
    return <i className={"fa fa-" + icon}></i>;
  },

  buildButtonContents: function () {
    
    var curStateProps = this.getCurStateProps();
    var icon = !!curStateProps.icon ? this.buildIcon(curStateProps.icon) : "";
    var text = !!curStateProps.text ? curStateProps.text : this.props.children;

    return (
      <div className="btn-contents">
        {icon}{text}
      </div>
    );
  },

  handleOnClick: function (e) {
    e.preventDefault();

    if(this.state.disabled) {
      return;
    }

    if(!!this.props.onClick && (typeof(this.props.onClick) == 'function')) {
      this.props.onClick(e);
    }
    else if(!!this.props.href) {
      this.getFlux().actions.navigate(this.props.href);
    }
  },

  render: function () {
    var cx = React.addons.classSet;
    var classes;

    var defaultStateProps = this.props.stateProps['default'] || [];
    var hoverStateProps   = this.props.stateProps['hover'] || [];

    classes = cx({
      'ghost-btn'        : true,
      'btn-full-width'   : this.props.fullWidth,
      
      'btn-filled'       : !!defaultStateProps.filled,
      'btn-grey'         : defaultStateProps.color === 'grey',
      'btn-dark-grey'         : defaultStateProps.color === 'dark-grey',
      'btn-white'        : defaultStateProps.color === 'white',
      'btn-red'          : defaultStateProps.color === 'red',
      'btn-blue'         : defaultStateProps.color === 'blue',
      'btn-green'        : defaultStateProps.color === 'green',
      
      'btn-hover-filled' : !!hoverStateProps.filled,
      'btn-hover-grey'   : hoverStateProps.color === 'grey',
      'btn-hover-dark-grey'   : hoverStateProps.color === 'dark-grey',
      'btn-hover-white'  : hoverStateProps.color === 'white',
      'btn-hover-red'    : hoverStateProps.color === 'red',
      'btn-hover-blue'   : hoverStateProps.color === 'blue',
      'btn-hover-green'  : hoverStateProps.color === 'green'
    });

    if (this.state.disabled) {
      classes = cx(
      {
        'btn-filled'       : !!defaultStateProps.filled,
        'ghost-btn'        : true,
        'btn-full-width'   : this.props.fullWidth,
        'btn-disabled'     : this.props.disabled,
      });
    }

    return this.transferPropsTo(
      <a className   = {classes + " " + this.props.className}
         onClick     = {this.handleOnClick}
         onMouseOver = {this.onMouseOver}
         onMouseOut  = {this.onMouseOut}>
         {this.buildButtonContents()}
      </a>
    );
  }
});
