/** @jsx React.DOM */
module.exports = React.createClass({

  getDefaultProps: function () {
    return {
      posX: 0,
      posY: 0
    };
  },

  renderCanvas : function () {
    if (this.isMounted() && this.props.src) {
      var el = this.getDOMNode();
      var ctx = el.getContext('2d');
      var props = this.props;
      var blurValue = _.isNumber(this.props.blurValue) ? this.props.blurValue : 7;

      var img = new Image();
      img.src = this.props.src;
      img.onload = function () {
        ctx.drawImage(this, props.posX, props.posY, el.width, el.height);

        // Blur value
        var e = blurValue;

        ctx.globalAlpha=0.5;

        for(var t=-e;t<=e;t+=2)
          for(var n=-e;n<=e;n+=2)
            ctx.drawImage(el,n,t),
              n>=0&&t>=0&&ctx.drawImage(el,-(n-1),-(t-1));

        ctx.globalAlpha=1;
      };


    }
  },

  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.src !== prevProps.src || 
        this.props.posX !== prevProps.posX ||
        this.props.posY !== prevProps.posY ||
        this.props.blurValue !== prevProps.blurValue) {
      this.renderCanvas();  
    }
  },

  componentDidMount: function () {
    this.renderCanvas();
  },

  render: function () {
    return this.transferPropsTo(<canvas className="blurred-art" width={400} height={400}/>);
  }

});
