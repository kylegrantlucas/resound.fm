/** @jsx React.DOM */
module.exports = React.createClass({

  getInitialState: function () {
    return {
      visible: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  },

  render: function() {
    var cx = React.addons.classSet;

    var popoverStyles = cx({
      'new-popover': true,
      'show': this.state.visible,
      'hidden': !this.state.visible,
      'top': this.props.position === 'top',
      'bottom': this.props.position === 'bottom'
    });

    popoverStyles += (" " + this.props.popoverID);

    var styleOverrides = {
      width: this.props.width,
      bottom: this.props.bottomOffset
    };

    return (
      <div className={popoverStyles} style={styleOverrides}>
        <div className='arrow-box'>
          {React.addons.cloneWithProps(React.Children.only(this.props.children), {visible : this.state.visible})}
        </div>
      </div>
    );
  }
});
