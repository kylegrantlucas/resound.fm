/** @jsx React.DOM */
module.exports = React.createClass({

  getInitialState: function () {
    return {
      visible: this.props.visible
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  },

  render: function() {
    var cx = React.addons.classSet;

    var calloutStyles = cx({
      'new-popover': true,
      'show': this.state.visible,
      'hidden': !this.state.visible,
      'top': this.props.top,
      'bottom': this.props.bottom,
      'left': this.props.left
    });

    var styleOverrides = {
      width: this.props.width,
      bottom: this.props.bottomOffset
    };

    return (
      <div className={calloutStyles} style={styleOverrides}>
        <div className='arrow-box'>
          {React.addons.cloneWithProps(React.Children.only(this.props.children), {visible : this.state.visible})}
        </div>
      </div>
    );
  }
});
