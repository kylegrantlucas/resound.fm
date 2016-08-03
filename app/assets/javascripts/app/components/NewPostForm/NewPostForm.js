/** @jsx React.DOM */

var ComposePostPage = require('app/components/NewPostForm/ComposePostPage');
var TrackSearchPage = require('app/components/NewPostForm/TrackSearchPage');
var ModalBackBtn = require('app/components/NewPostForm/ModalBackBtn');
var ModalCloseBtn = require('app/components/NewPostForm/ModalCloseBtn');
var ViewHelpers = require('app/lib/ViewHelpers');

module.exports = React.createFluxClass({

  onTrackSelected: function (track) {
    this.getFlux().actions.selectNewPostTrack(track);
  },

  buildPage: function () {
    var newPostForm = this.props.newPostForm;

    if (newPostForm.page === 'track-search') {
      return <TrackSearchPage modalShown={newPostForm.modalShown} onTrackSelected={this.onTrackSelected} key='trackSearchPage' />;
    } else {
      return <ComposePostPage preview={this.props.preview} posting={newPostForm.posting} newPost={newPostForm.newPost} key='composePostPage' />;
    }
  },

  render: function() {
    var newPostForm = this.props.newPostForm;

    return (
      <div className="new-post-form">
        {ViewHelpers.showIf(newPostForm.page == 'compose-post',
          <ModalBackBtn label="choose song"/>
        )}
        <ModalCloseBtn modalShown={newPostForm.modalShown}/>
        <div className="container">
          <div className="row">
            {this.buildPage()}
          </div>
        </div>
      </div>
    );
  }

});
