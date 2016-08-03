/** @jsx React.DOM */
var SearchBar = require('app/components/NavBar/SearchBar');
var NotificationsPopover = require('app/components/Notifications/NotificationsPopover');
var UserMenuPopover = require('app/components/NavBar/UserMenuPopover');
var ModalTrigger = require('app/components/Modals/ModalTrigger');
var NewPostBtn = require('app/components/Buttons/NewPostBtn');
var Link = require('app/components/Link');

module.exports = React.createFluxClass({

  getInitialState: function () {
    return {
      searchVisible: false
    };
  },

  activePage: function (page) {
    return this.props.page === page ? 'active' : '';
  },

  onSearch: function (result) {
    this.getFlux().actions.navigate(result.url);
    this.setState({
      searchVisible: false
    });
  },

  showSearch: function (e) {
    e.preventDefault();
    this.setState({
      searchVisible: true
    });

    var self = this;

    // TODO: Yeah... this is gross sorry not sorry.
    setTimeout(function () {
      $(self.refs.searchBar.getDOMNode()).find('.search-box').focus();
    }, 10);
  },

  hideSearch: function (e) {
    this.setState({
      searchVisible: false
    });
  },

  render: function () {
    var user = this.props.curUser;

    var cx = React.addons.classSet;

    var centerNavStyles = cx({
      'center-nav': true,
      'show': !this.state.searchVisible,
      'hidden': this.state.searchVisible
    });

    var searchBoxStyles = cx({
      'show': this.state.searchVisible,
      'hidden': !this.state.searchVisible
    });

    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div>
            <ul className="nav navbar-nav navbar-left">
              <Link href="/feed" className="navbar-brand"></Link>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="new-post">
                <NewPostBtn/>
              </li>
              <li className="notifications">
                <NotificationsPopover notifications={this.props.notifications}/>
              </li>
              <li className="user-account dropdown">
                <UserMenuPopover user={user}/>
              </li>
            </ul>
            <ul className={centerNavStyles} >
              <li className={this.activePage('feed')}>
                <Link href="/feed"><i className="fa fa-list"></i>Feed</Link>
              </li>
              <li className={this.activePage('explore')}>
                <Link href="/explore"><i className="fa fa-compass"></i>Explore</Link>
              </li>
              <li className={this.activePage('trending')}>
                <Link href="/trending"><i className="fa fa-external-link-square"></i>Trending</Link>
              </li>
              <li className={this.activePage('liked')}>
                <Link href="/liked"><i className="fa fa-heart"></i>Liked</Link>
              </li>
              <li>
                <Link href="" onClick={this.showSearch}><i className="fa fa-search"></i>Search</Link>
              </li>
            </ul>
            <SearchBar className={searchBoxStyles} ref='searchBar' onSelected={this.onSearch} onCancel={this.hideSearch} />
          </div>
        </div>
      </nav>
    );
  }
});
