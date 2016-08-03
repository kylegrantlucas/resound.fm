/** @jsx React.DOM */

var Feed = require('app/components/Feed');
var FeedPageFlash = require('app/components/FeedPageFlash');
var UserHelpers = require('app/helpers/UserHelpers');
var SidebarSection = require('app/components/Sidebar/SidebarSection');
var SuggestedUsers = require('app/components/Sidebar/SuggestedUsersSidebarSection');
var TrendingHashtags = require('app/components/Sidebar/TrendingHashtagsSidebarSection');

module.exports = React.createFluxClass({

  componentWillMount: function () {
    _.defer(this.getFlux().actions.changePage, 'feed');
  },

  render: function () {
    var curUser = this.props.curUser;

    return (
      <div className="container">
        <FeedPageFlash curUser={curUser}/>
        <div className="row">
          <div className='sidebar sidebar-left hidden-xs hidden-sm col-md-4 col-lg-3'>
            <TrendingHashtags tags={this.props.trendingTags}/>
            <SuggestedUsers className="hidden-lg" curUser={curUser}/>
          </div>
          <div className='col-sm-12 col-md-8 col-lg-6'>
            <Feed page='feed' curUser={curUser} />
          </div>
          <div className='sidebar sidebar-right hidden-xs hidden-sm hidden-md col-lg-3'>
            <SuggestedUsers className="visible-lg" curUser={curUser}/>
          </div>
        </div>
      </div>
    );
  }
});
