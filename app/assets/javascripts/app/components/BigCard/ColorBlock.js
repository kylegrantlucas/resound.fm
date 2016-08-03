/** @jsx React.DOM */

module.exports = React.createClass({

  render: function() {
    var color = this.props.track.color1;
    
    var styles = {
      backgroundColor: color
      //background: "linear-gradiendt(left top, " + color1 + " 50%, " + color2 + ")"
       // "-webkit-linear-gradient(left top, " + color1 + " 50%, " + color2 + ")"
       // "-moz-linear-gradient(left top, " + color1 + " 50%, " + color2 + ")"
       // "-o-linear-gradient(left top, " + color1 + " 50%, " + color2 + ")"
    }

    return this.transferPropsTo(
      <div className="color-block" style={styles}/>
    );
  }
});