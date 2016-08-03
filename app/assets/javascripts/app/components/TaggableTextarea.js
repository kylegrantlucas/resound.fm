/** @jsx React.DOM */

var API = require('app/lib/API');
var ViewHelpers = require('app/lib/ViewHelpers');

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

  getInitialState: function() {
    return {
      value: null,
      results: [],
      selectionIndex: 0,
      xhr: null
    };
  },

  getDefaultProps: function () {
    return {
      onPost: function (e, value, resetFn) {}
    };
  },

  clickOutsideHandler: function (e) {
    if (this.isMounted() && !$(this.getDOMNode()).is(e.target) && $(this.getDOMNode()).has(e.target).length === 0) {
      this.removeSelection();
    }
  },

  componentDidMount: function() {
    $(document).bind("click", _.bind(this.clickOutsideHandler, this));

    if (this.props.autosize) {
      // By default jquery.autosize appends a newline character.
      // We don't need this extra blank line in the textarea so we append
      // an empty string.
      $(this.refs.textarea.getDOMNode()).autosize({append: ''});
    }
  },

  componentWillUnmount: function() {
    $(this.refs.textarea.getDOMNode()).trigger('autosize.destroy');
    $(document).unbind("click", _.bind(this.clickOutsideHandler, this));
  },

  getValue: function () {
    return this.state.value;
  },

  focus: function () {
    $(this.refs.textarea.getDOMNode()).focus();
  },

  onChange: function(e) {
    var value = e.target.value

    var matchValue = value.slice(0, ViewHelpers.getCursorPos(e.target));

    if (matchValue) {
      var matches = matchValue.match(/(?:^|\s)([@#]\w[\w\.]*\w)$/gi);
      if (matches && matches.length > 0) {
        this.search(matches[0]);
      } else {
        this.removeSelection();
      }
    }

    this.setState({
      value: value,
      highlightedText: this.buildHighlightedText(value)
    });
  },

  buildHighlightedText: function (text) {
    var elements = [];

    if (text) {
      var lines = text.split(/\n/gi);
      elements = lines.map(function (line, i) {
        var tags = line.split(/([@#]\w[\w\.]*\w)/gi);

        var lineEls = tags.map(function (cur, i) {
          if (i % 2 === 1) {
            return <b>{cur}</b>;
          } else {
            return cur;
          }
        });

        lineEls.push(<br/>);

        return lineEls;
      });

    }

    return elements;
  },

  onSelected: function (e, result) {
    e.preventDefault();

    var beforeCursorValue = this.state.value.slice(0, ViewHelpers.getCursorPos(this.refs.textarea.getDOMNode()));
    var afterCursorValue = this.state.value.slice(beforeCursorValue.length, this.state.value.length);

    var newValue;
    if (result.type === 'tag') {
      newValue = beforeCursorValue.replace(/([#])(\w[\w\.]*\w)$/gi, '#' + result.text + " ");
    } else {
      newValue = beforeCursorValue.replace(/([@#])(\w[\w\.]*\w)$/gi, '@' + result.username + " ");
    }

    newValue += afterCursorValue;

    this.setState({
      value: newValue,
      highlightedText: this.buildHighlightedText(newValue)
    });

    $(this.refs.textarea.getDOMNode()).focus();

    this.removeSelection();
  },

  removeSelection: function () {
    this.cancelSearch();

    this.setState({
      results: [],
      selectionIndex: 0
    });
  },

  reset: function () {
    this.cancelSearch();
    $(this.refs.textarea.getDOMNode()).trigger('autosize.resize');

    return this.setState({
      results: [],
      selectionIndex: 0,
      value: '',
      xhr: null,
      highlightedText: ''
    });
  },

  onHover: function (result) {
    this.setState({
      selectionIndex: this.state.results.indexOf(result)
    });
  },

  onKeyDown: function (e) {
    if (this.state.results.length > 0) {
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
        this.onSelected(e, this.state.results[this.state.selectionIndex]);
      } else if (e.keyCode == KeyEvent.DOM_VK_ESCAPE) {
        this.removeSelection();
      }
    } else if (e.keyCode == KeyEvent.DOM_VK_RETURN || e.keyCode == KeyEvent.DOM_VK_ENTER) {
      this.props.onPost(e, this.getValue(), this.reset);
    }
  },

  search: _.debounce(function (query) {
    this.setState({
      loading: true,
      xhr: API.get('/api/search', { query: query }, function (err, res) {
          if (err) {
            return console.log(err);
          }

          this.setState({
            loading: false,
            results: res,
            selectionIndex: 0
          });
        }.bind(this))
    });

  }, 300),

  cancelSearch: function () {
    if (this.state.xhr) {
      this.state.xhr.abort();
    }
  },

  render: function () {
    var self = this;

    var tagItems = this.state.results.map(function(result, i) {
      var onClick = function(e){
        this.onSelected(e, result);
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

    return (
      <div className={'taggable-textarea ' + (this.props.className || '')}>
        <div className='highlighted-tags'>{this.state.highlightedText}</div>
        {this.transferPropsTo(<textarea className="form-control" value={this.state.value} onKeyDown={this.onKeyDown} onChange={this.onChange} placeholder={this.props.placeholder} ref='textarea'/>)}
        <ul className='results'>
          {tagItems}
        </ul>
      </div>
    );
  }

});
