/** @jsx React.DOM */

//=require libs
// Require Root Modules
require('app/initializers/React');
require('app/initializers/Flux');
require('app/initializers/KeyEvents');
require('app/initializers/Popover');
require('app/initializers/Rollbar')(bootstrap.curUser);
require('app/initializers/GA')(bootstrap.curUser);
require('app/initializers/Soundcloud');
require('app/initializers/Youtube');
require('app/initializers/Tooltip');
var Onboarding = require('app/initializers/Onboarding');


var CurUserStore = require('app/stores/CurUserStore');
var UsersStore = require('app/stores/UsersStore');
var FollowingRecsStore = require('app/stores/FollowingRecsStore');
var NewPostStore = require('app/stores/NewPostStore');
var FollowersStore = require('app/stores/FollowersStore');
var FollowingsStore = require('app/stores/FollowingsStore');
var PostsStore = require('app/stores/PostsStore');
var TrendingTagsStore = require('app/stores/TrendingTagsStore');
var NotificationsStore = require('app/stores/NotificationsStore');
var PlayerPositionStore = require('app/stores/PlayerPositionStore');
var PlayerStore = require('app/stores/PlayerStore');
var CurPageStore = require('app/stores/CurPageStore');
var FavoritesStore = require('app/stores/FavoritesStore');
var AnalyticsStore = require('app/stores/AnalyticsStore');

var Actions = require('app/actions/Actions');

var stores = {
  CurUser: new CurUserStore(window.bootstrap),
  TrendingTags: new TrendingTagsStore(window.bootstrap),
  NewPost: new NewPostStore(window.bootstrap),
  PagePosts: new PostsStore(window.bootstrap),
  Users: new UsersStore(window.bootstrap),
  Followers: new FollowersStore(window.bootstrap),
  Followings: new FollowingsStore(window.bootstrap),
  FollowingRecs: new FollowingRecsStore(window.bootstrap),
  Notifications: new NotificationsStore(window.bootstrap),
  //PlayerPos: new PlayerPositionStore(window.bootstrap),
  Favorites: new FavoritesStore(),
  Player: new PlayerStore(window.bootstrap),
  CurPage: new CurPageStore(window.bootstrap),
  Analytics: new AnalyticsStore(window.bootstrap)
};

var flux = new Fluxxor.Flux(stores, Actions);

var App = require('app/pages/App');

React.renderComponent(<App flux={flux}/>, document.getElementById('app'), function () {
  Onboarding.onReady(bootstrap.curUser);
});
