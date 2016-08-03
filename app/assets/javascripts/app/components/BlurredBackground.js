/** @jsx React.DOM */
var BlurredImage = require('app/components/BlurredImage');

module.exports = React.createClass({

  render: function () {
    var image = this.props.image;

    if (image) {
        return <BlurredImage src={image}/>;
    } else {
      return <div/>;
    }
  }

});
