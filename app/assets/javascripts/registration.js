//=require libs
// Require Root Modules
require('app/initializers/React');
require('app/initializers/Flux');
require('app/initializers/KeyEvents');
require('app/initializers/Popover');
require('app/initializers/Raven');

var CurUserStore = require('app/stores/CurUserStore');
var UsersStore = require('app/stores/UsersStore');
var FollowersStore = require('app/stores/FollowersStore');

var Actions = require('app/actions/Actions');

var stores = {
  CurUser: new CurUserStore(window.bootstrap),
  UsersStore: new UsersStore(window.bootstrap),
  Followers: new FollowersStore(window.bootstrap)
};

var flux = new Fluxxor.Flux(stores, Actions);

// Require Root Modules
var RegistrationApp = require('app/pages/RegistrationApp');
React.renderComponent(new RegistrationApp({flux: flux}), document.getElementById('app'));
