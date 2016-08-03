/** @jsx React.DOM */

var API = require('app/lib/API');
var Button = require('app/components/Buttons/SimpleButton');

var UserResult = React.createClass({
  render: function () {
    return (
      <li onClick={this.props.onClick} onMouseEnter={this.props.onMouseEnter} className={this.props.className}>
        <img src={this.props.result.icon} />
        <div className='info'>
          <p>{this.props.result.first_name + ' ' + this.props.result.last_name}</p>
        </div>
      </li>
    );
  }
});

var TagResult = React.createClass({
  render: function () {
    return (
      <li onClick={this.props.onClick} onMouseEnter={this.props.onMouseEnter} className={this.props.className}>
        <div className='info'>
          <p>{'#' + this.props.result.text}</p>
        </div>
      </li>
    );
  }
});

module.exports = React.createClass({

  getDefaultProps: function() {
    return {
      onSelected: function(result) { },
      onCancel: function() { }
    };
  },

  clickOutsideHandler: function (e) {
    if (this.isMounted() && !$(this.getDOMNode()).is(e.target) && $(this.getDOMNode()).has(e.target).length === 0) {
      this.reset();
    }
  },

  componentDidMount: function() {
    $(document).bind("click", _.bind(this.clickOutsideHandler, this));
  },

  componentWillUnmount: function() {
    $(document).unbind("click", _.bind(this.clickOutsideHandler, this));
  },

  getInitialState: function () {
    this.search = _.debounce(function (query) {
      this.setState({
        loading: true
      });

      API.get('/api/search', { query: query }, function (err, res) {
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
      this.setState({
        selectionIndex: this.state.selectionIndex - 1
      });
    } else if (e.keyCode == KeyEvent.DOM_VK_DOWN && this.state.selectionIndex < this.state.results.length - 1) {
      this.setState({
        selectionIndex: this.state.selectionIndex + 1
      });
    } else if (e.keyCode == KeyEvent.DOM_VK_RETURN || e.keyCode == KeyEvent.DOM_VK_ENTER) {
      this.onSelected(this.state.results[this.state.selectionIndex]);
    } else if (e.keyCode == KeyEvent.DOM_VK_ESCAPE) {
      this.reset();
    }
  },

  onCancel: function (e) {
    e.preventDefault();
    this.reset();
    this.props.onCancel();
  },

  onSelected: function (result) {
    this.props.onSelected(result);
    this.reset();
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

      if (result.type === 'tag') {
        return <TagResult result={result} onClick={onClick} onMouseEnter={onHover} className={selected} key={i} />;
      } else {
        return <UserResult result={result} onClick={onClick} onMouseEnter={onHover} className={selected} key={i} />;
      }

    });

    return (this.transferPropsTo(
      <div className="search-bar-container">
        <div className="search-bar-content">
          <Button className="search-button" color='white' onClick={this.onCancel} text='Cancel'/>
          <div className='search-bar'>
            <input type="search" ref='searchTerm' onChange={this.onChange} className={classes} onKeyDown={this.onKeyDown} onBlur={this.onBlur} placeholder="Search for users or tags..." />
            <ul className='search-results'>
              {searchResults}
            </ul>
          </div>
        </div>
      </div>
    ));
  }
});
