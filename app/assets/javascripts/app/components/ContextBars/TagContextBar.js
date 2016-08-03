/** @jsx React.DOM */

var Link = require('app/components/Link');

module.exports = React.createClass({

  render: function () {
    return (
      <div className='tag-context-bar'>
        <div className='container'>
          <div className='row'>
            <div className="col-xs-12">
              <h1 className="hashtag-header"><span className="hashtag-symbol">#</span>{this.props.tag}</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
