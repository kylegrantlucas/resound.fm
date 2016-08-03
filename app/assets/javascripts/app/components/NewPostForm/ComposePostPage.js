/** @jsx React.DOM */
var TaggableTextarea = require('app/components/TaggableTextarea');
var PostButton = require('app/components/Buttons/PostButton');
var UserHelpers = require('app/helpers/UserHelpers');
var TrackHelpers = require('app/helpers/TrackHelpers');
var ViewHelpers = require('app/lib/ViewHelpers');
var TrackMedia = require('app/components/BigCard/TrackMedia');
var TrackInfo = require('app/components/BigCard/TrackInfo');
var ColorBlock = require('app/components/BigCard/ColorBlock');
var BigCard = require('app/components/BigCard/BigCard');

var AltVideo = React.createClass({

  onClick: function () {
    this.props.onSelected(this.props.video);
  },

  render: function() {
    var video = this.props.video;
    var track = this.props.track;
    var isSelected = this.props.video.key === track.key;

    var classes = "alt-video" + (isSelected ? " selected" : "");

		return (
			<div className={classes} onClick={this.onClick}>
				<img src={TrackHelpers.videoThumbnailUrl(video)} />
        <p>{video.title}</p>
			</div>
		);
	}
});

module.exports = React.createFluxClass({

	buildPreviewPlayer: function () {
		var newPost = this.props.newPost;
		var key = newPost.track.key;

		if (TrackHelpers.isSoundcloud(newPost.track)) {
			return <iframe className="preview-player sc" width="100%" height="140" scrolling="no" frameBorder="no" src={"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + key + "&color=0066cc"}></iframe>;
		} else {
			return <iframe className="preview-player yt" type="text/html" width="650" height="275" src={"http://www.youtube.com/embed/" + key + "?enablejsapi=1&showinfo=0"} frameBorder="0"></iframe>
		}
	},

	altVideoSelected: function (video) {
    this.getFlux().actions.selectNewPostVideo(video);
	},

  altVideosAvailable: function() {
    var altVideos = this.props.newPost.track.videos;
    return (altVideos && altVideos.length > 0);
  },

	buildAltVideoThumbs: function () {
    var track = this.props.newPost.track;
		var altVideos = this.props.newPost.track.videos;

		if (altVideos && altVideos.length > 0) {
			return (
				<div className="alt-videos">
    			{altVideos.map(function (video) {
    				return <AltVideo video={video} track={track} onSelected={this.altVideoSelected} />}, this)
    			}
    		</div>
    	);
		} else {
			return <span/>;
		}
	},

	post: function () {
    if (this.props.newPost.track.broken_track) {
      this.getFlux().actions.newPostGoBack();
    } else {
      var message = this.refs.previewCard.getMessage();
      this.getFlux().actions.saveNewPost(message);  
    }
    
  },

  componentDidMount: function () {
    //var track = this.props.newPost.track;
    
    // if (TrackHelpers.isYoutube(track)) {
    //   var el = this.refs.previewCard.getDOMNode();
    //   var pos = ViewHelpers.getOffsetRect(el);
    //   _.defer(this.getFlux().actions.previewCardShow, pos);
    //   this.attachScrollListener();  
    // }
  },

  componentDidUpdate: function () {
    var track = this.props.newPost.track;

    // if (TrackHelpers.isYoutube(track)) {
    //   this.attachScrollListener();  
    // } else {
    //   this.detachScrollListener();
    // }
  },

  componentWillUnmount: function () {
    var track = this.props.newPost.track;
    //this.detachScrollListener();

    _.defer(this.getFlux().actions.previewCardHide);
  },

  // attachScrollListener: function () {
  //   document.getElementsByClassName('modal-bg')[0].addEventListener('scroll', this.scrollListener);
  //   window.addEventListener('scroll', this.scrollListener);
  //   window.addEventListener('resize', this.scrollListener);
  //   this.scrollListener();
  // },

  // detachScrollListener: function () {
  //   document.getElementsByClassName('modal-bg')[0].removeEventListener('scroll', this.scrollListener);
  //   window.removeEventListener('scroll', this.scrollListener);
  //   window.removeEventListener('resize', this.scrollListener);
  // },

  // scrollListener: function () {
  //   var el = this.refs.previewCard.getDOMNode();
  //   var pos = ViewHelpers.getOffsetRect(el);
  //   _.defer(this.getFlux().actions.previewCardChangePos, pos);  
  // },

  render: function() {
  	var newPost = this.props.newPost;
    var track = newPost.track;
  	var user = newPost.user;
    var playState = this.props.preview.playState;

    return (
    	<div className="compose-post-page col-xs-12">
        <div className="container-fluid">
          <div className="row">
            <div className="dummy-card-container col-xs-12">
              <BigCard ref='previewCard' isCurPost={true} playState={playState} post={newPost} preview/>
            </div>
            <div className="col-xs-6 col-xs-offset-3">
              <PostButton brokenTrack={track.broken_track} fullWidth posting={this.props.posting} onClick={this.post} />
            </div>
            {ViewHelpers.showIf(this.altVideosAvailable(),
              <div className="alt-videos-container col-xs-12">
                <p className="truncate-with-ellipses">Did we choose a bad source video? Choose a better one!</p>
                {this.buildAltVideoThumbs()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

});
