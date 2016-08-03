/** @jsx React.DOM */

var API = require('app/lib/API');
var Spinner = require('app/components/NewPostForm/TrackSearchSpinner');
var TrackSource = require('app/components/BigCard/TrackSource');

var SearchResult = React.createClass({
  render: function () {
    return (
      <li onClick={this.props.onClick} onMouseEnter={this.props.onMouseEnter} className={this.props.className}>
        <img className='thumb' src={this.props.result.icon100} />
        <div className='info'>
          <p className="title truncate-with-ellipses">{this.props.result.name}</p>
          <p className="artist truncate-with-ellipses">{this.props.result.artist}</p>
        </div>
        <TrackSource track={this.props.result} disabled/>
      </li>
    );
  }
});

module.exports = React.createClass({

  getDefaultProps: function() {
    return {
      onTrackSelected: function(result) { }
    };
  },

  getInitialState: function () {
    this.search = _.debounce(function (query) {
      this.setState({
        loading: true
      });

      API.get('/api/tracks', { query: query }, function (err, res) {
        if (err) {
          return console.log(err);
        }

        this.setState({
          loading: false,
          results: res,
          selectionIndex: 0
        });
      }.bind(this));
    }, 300);

    return {
      loading: false,
      results: [],
      selectionIndex: null
    };
  },

  reset: function () {
    this.setState({
      loading: false,
      results: []
    });

    $(this.refs.searchTerm.getDOMNode()).val('');
  },

  onChange: function (e) {
    if (e.target.value.length > 2) {
      this.search(e.target.value);
    }
  },

  onKeyDown: function (e) {
    if (e.keyCode == KeyEvent.DOM_VK_UP && this.state.selectionIndex > 0) {
      e.preventDefault();
      this.setState({
        selectionIndex: this.state.selectionIndex - 1
      });
    } else if (e.keyCode == KeyEvent.DOM_VK_DOWN && this.state.selectionIndex < this.state.results.length - 1) {
      e.preventDefault();
      this.setState({
        selectionIndex: this.state.selectionIndex + 1
      });
    } else if (e.keyCode == KeyEvent.DOM_VK_RETURN || e.keyCode == KeyEvent.DOM_VK_ENTER) {
      this.onSelected(this.state.results[this.state.selectionIndex]);
    } else if (e.keyCode == KeyEvent.DOM_VK_ESCAPE) {
      e.stopPropagation();
      this.reset();
    }
  },

  onSelected: function (result) {
    if (result) {
      this.props.onTrackSelected(result);
      this.reset();
    }
  },

  onHover: function (result) {
    this.setState({
      selectionIndex: this.state.results.indexOf(result)
    });
  },

  render: function () {
    var self = this;

    var cx = React.addons.classSet;
    var classes = cx({
      'form-control': true,
      'search-box': true,
      'loading': this.state.loading
    });

    var searchResults = this.state.results.map(function(result, i) {
      var onClick = function(){
        this.onSelected(result);
      }.bind(self);

      var onHover = function(){
        this.onHover(result);
      }.bind(self);

      var selected = (i === self.state.selectionIndex) ? 'selected' : '';

      return <SearchResult result={result} onClick={onClick} onMouseEnter={onHover} className={selected} key={i} />;
    });

    var icon = this.state.loading ? <Spinner/> : <i className="fa fa-search"/>;

    return (
      <div className='track-search'>
        <div className="right-inner-addon">
          {icon}
          <input type="search" ref='searchTerm' onChange={this.onChange} className={classes} onKeyDown={this.onKeyDown} onBlur={this.onBlur} placeholder="Search for an artist or song&hellip;"/>
        </div>
        
        <ul className='search-results'>
          {searchResults}
        </ul>
      </div>
    );
  }

});
