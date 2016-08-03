/** @jsx React.DOM */

var NavBar = require('app/components/NavBar/NavBar');
var BlurredBackground = require('app/components/BlurredBackground');
var ModalContainer = require('app/components/Modals/ModalContainer');
var HoverPlayer = require('app/components/HoverPlayer');
var FooterPlayer = require('app/components/FooterPlayer/FooterPlayer');
var Feed = require('app/components/Feed');
var FeedPageFlash = require('app/components/FeedPageFlash');
var SuggestedUsers = require('app/components/Sidebar/SuggestedUsersSidebarSection');
var TrendingHashtags = require('app/components/Sidebar/TrendingHashtagsSidebarSection');
var NotificationsList = require('app/components/Notifications/NotificationsList');
var Spinner = require('app/components/Spinner');
var UserFollowers = require('app/components/UserFollowers');
var UserFollowings = require('app/components/UserFollowings');
var UserContextBar = require('app/components/ContextBars/UserContextBar');
var TagContextBar = require('app/components/ContextBars/TagContextBar');
var RouterPushStateMixin = require('app/mixins/RouterPushStateMixin');
var UserRecsPage = require('app/components/UserRecsPage');
var TestModule = require('app/components/Tests/TestModule');

module.exports = React.createClass({

  mixins: [Fluxxor.FluxMixin(React), Fluxxor.StoreWatchMixin('CurUser', 'CurPage', 'NewPost', 'Notifications', 'Player', 'TrendingTags'), RouterPushStateMixin],

  getStateFromFlux: function() {
    var flux = this.getFlux();
    var newPostStore = flux.store('NewPost');
    var curUserStore = flux.store('CurUser');
    var curPageStore = flux.store('CurPage');
    var notificationsStore = flux.store('Notifications');
    var playerStore = flux.store('Player');
    var trendingTagsStore = flux.store('TrendingTags');

    return {
      trendingTags: trendingTagsStore.getState().tags,
      curUser: curUserStore.getState().user,
      newPostForm: newPostStore.getState(),
      notifications: notificationsStore.getState(),
      player: playerStore.getState(),
      curPost: playerStore.getCurPost(),
      curPlayerId: playerStore.getCurPlayerId(),
      curPageContext: curPageStore.getState(),
      contentType: curPageStore.type
    };
  },

  componentWillMount: function () {
    var flux = this.getFlux();
    var playerStore = flux.store('Player');
    playerStore.setInitialContext(this.state.curPageContext);
  },

  buildCenterContent: function () {
    var context = this.state.curPageContext;
    var type = this.state.contentType;
    var curUser = this.state.curUser;

    if (type === 'posts' || type === 'post') {
      return <Feed context={context} curUser={curUser}/>;
    } else if (type === 'users') {
      if (context.page === 'userfollowers') {
        return <UserFollowers curUser={curUser}/>;
      } else if (context.page === 'userfollowings') {
        return <UserFollowings curUser={curUser}/>;
      } else if (context.page === 'whotofollow') {
        return <UserRecsPage curUser={curUser}/>;
      }
    } else if (type === 'notifications') {
      return <NotificationsList curUser={curUser} notifications={this.state.notifications} visible={true} />;
    } else {
      return <Spinner className='content-spinner'/>;
    }
  },

  buildContextBar: function () {
    var context = this.state.curPageContext;
    var curUser = this.state.curUser;

    switch (context.page) {
      case 'tag':
        return (
          <div className='context-bar-container tag-context'>
            <TagContextBar tag={context.pageOpts.tag}/>
          </div>
        );
        break;
      case 'userposts':
      case 'userliked':
      case 'userfollowers':
      case 'userfollowings':
        return (
          <div className='context-bar-container user-info-context'>
            <UserContextBar userId={context.pageOpts.userId} curUser={curUser}/>
          </div>
        );
      default:
        return <div/>
    }
  },

  buildContent: function (curUser, trendingTags) {

    switch (this.state.curPageContext.page) {
      case "trending":
        return (
          <div className="content container">
            <div className="row">
              <div className='hidden-xs hidden-sm hidden-md col-lg-3'/>
              <div className='col-sm-12 col-md-8 col-lg-6'>
                {this.buildCenterContent()}
              </div>
              <div className='hidden-xs hidden-sm col-md-4 col-lg-3'>                
                <div className='sidebar sidebar-right'>
                  <TrendingHashtags tags={trendingTags}/>
                  <SuggestedUsers curUser={curUser}/>
                </div>
              </div>
            </div>
          </div>
        );
        break;
      case "whotofollow":
        return (
          <div className="content container">
            <div className="row">
              <div className='hidden-xs hidden-sm hidden-md col-lg-3'/>
              <div className='col-sm-12 col-md-12 col-lg-6'>
                {this.buildCenterContent()}
              </div>
              <div className='hidden-xs hidden-sm hidden-md col-lg-3'/>                
            </div>
          </div>
        );
        break;
      case 'userposts':
      case 'userliked':
      case 'userfollowers':
      case 'userfollowings':
        return (
          <div className="content container">
            <div className="row">
              <div className='hidden-xs hidden-sm hidden-md col-lg-3'>
                <div className='sidebar sidebar-left'>
                </div>
              </div>
              <div className='col-sm-12 col-md-8 col-lg-6'>
                {this.buildCenterContent()}
              </div>
              <div className='hidden-xs hidden-sm col-md-4 col-lg-3'>
                <div className='sidebar sidebar-right'>
                </div>
              </div>
            </div>
          </div>
        );
        break;
      default:
        return (
          <div className="content container">
            <div className="row">
              <div className='hidden-xs hidden-sm col-md-4 col-lg-3'>
                <div className='sidebar sidebar-left'>
                  <TrendingHashtags tags={trendingTags}/>
                  <SuggestedUsers className="visible-md" curUser={curUser}/>
                </div>
              </div>
              <div className='col-sm-12 col-md-8 col-lg-6'>
                {this.buildCenterContent()}
              </div>
               <div className='hidden-xs hidden-sm hidden-md col-lg-3'>
                <div className='sidebar sidebar-right'>
                  <SuggestedUsers curUser={curUser}/>
                </div>
              </div>
            </div>
          </div>
        );
    }
  },

  render: function () {
    var player = this.state.player;
    var curUser = this.state.curUser;
    var trendingTags = this.state.trendingTags;
    var flux = this.props.flux;
    var newPostForm = this.state.newPostForm;
    var curPost = this.state.curPost;
    var pageContext = this.state.curPageContext;

    var bgImage = curPost && curPost.track ? curPost.track.icon400 : null; 

    var cx = React.addons.classSet;
    
    var appWrapperClasses = cx({
      'app-wrapper': true,
      'modal-app-wrapper': newPostForm.modalShown
    });

    var appClasses = cx({
      'app': true,
      'modal-app': newPostForm.modalShown
    });

    return (
      <div className={appWrapperClasses}>
        <div className={appClasses}>
          <BlurredBackground image={bgImage}/>
          <NavBar curUser={curUser} page={pageContext.page} notifications={this.state.notifications}/>
          {this.buildContextBar()}
          {this.buildContent(curUser, trendingTags)}
          <FooterPlayer player={player} curPost={curPost}/>
        </div>
        <ModalContainer preview={player.preview} newPostForm={newPostForm}/>
        <HoverPlayer curPostId={player.curPostId} curPlayerId={this.state.curPlayerId} playerContext={player.curPost.context} newPostForm={newPostForm}/>
      </div>
    );
  }

});
