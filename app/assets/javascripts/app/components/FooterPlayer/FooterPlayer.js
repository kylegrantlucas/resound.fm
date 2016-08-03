/** @jsx React.DOM */

var MediaControls = require('app/components/FooterPlayer/MediaControls');
var FooterLikeBtn = require('app/components/FooterPlayer/FooterLikeBtn');
var SeekBar = require('app/components/FooterPlayer/SeekBar');
var ViewHelpers = require('app/lib/ViewHelpers');
var UserHelpers = require('app/helpers/UserHelpers');
var Link = require('app/components/Link');

module.exports = React.createFluxClass({

  goToCurPost: function () {
    this.getFlux().actions.goToCurPost();
  },

  render: function () {
    var player = this.props.player;
    var curPost = this.props.curPost;

    if (curPost) {
      var user = curPost.user;

      return (
        <div className="footer-player">
          <div className="footer-bg"/>
          <img className="album-art" src={curPost.track.icon100} onClick={this.goToCurPost}/>
          <div className="footer-container">
            <div className="container-fluid">
              <div className="row">
                <SeekBar pos={player.curPost.pos} duration={curPost.track.duration} />
              </div>
              <div className="row">
                <div className="cur-song col-xs-8 col-sm-4 col-md-5">
                  <div className="info" onClick={this.goToCurPost}>
                    <h4 className="name">{curPost.track.name}</h4>
                    <h4 className="artist small">{curPost.track.artist}</h4>
                  </div>
                </div>
                <div className="media-controls-container col-xs-4 col-sm-4 col-md-2">
                  <MediaControls playState={player.curPost.playState} postId={curPost.id}/>
                </div>
                <div className="cur-song-btns hidden-xs col-sm-4 col-md-5">
                  <FooterLikeBtn post={curPost} showCount={false} pullRight/>
                  <Link className='poster-info pull-right' href={UserHelpers.profileUrl(user)}>
                    <img src={user.icon} />
                    <span>{UserHelpers.fullName(user)}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div/>;
    }
  }
});
