/** @jsx React.DOM */
var Link = require('app/components/Link');

module.exports = React.createClass({

  render: function () {
    return(this.transferPropsTo(
      <div className='sidebar-section card-shadow'>
        <Link className="sidebar-title" href={this.props.headerLink || "#"}>
          {this.props.headerTitle}
        </Link>
        <div className='sidebar-content'>
          {this.props.children}
        </div>
      </div>
    ))
  }
});