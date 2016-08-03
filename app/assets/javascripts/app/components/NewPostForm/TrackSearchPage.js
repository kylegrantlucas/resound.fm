/** @jsx React.DOM */
var TrackSearch = require('app/components/NewPostForm/TrackSearch');

module.exports = React.createClass({

  render: function() {
  	return (
			<div className="track-search-page">
				<h1>New Post</h1>
				{this.transferPropsTo(<TrackSearch />)}
			</div>
		);
  }

});
