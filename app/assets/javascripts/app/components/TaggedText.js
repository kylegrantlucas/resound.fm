/** @jsx React.DOM */

var Link = require('app/components/Link');

module.exports = React.createClass({

  render: function() {
    var strings = null;
    var elements = [];

    if (this.props.text) {
      strings = this.props.text.split(/((?:[@#]\w[\w\.]*\w)|(?:(?:https?:\/\/(?:www\.)?)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)))/gi);
      elements =  _.map(strings, function(str, i) {
        if (i % 2 === 1 && str && str.length > 0) {
          switch (str[0]) {
            case '#':
              return <Link type={'Hashtag'} location={this.props.location} className='hashtag' href={'/tags/' + str.substring(1)}>{str}</Link>;
            case '@':
              return <Link type={'Mention'} location={this.props.location} className='hashtag' href={'/users/' + str.substring(1)}>{str}</Link>;
            default:
              var href = str;
              if (!(/^https?:\/\//gi).test(href)) {
                href = "http://" + href;
              }
              return <a href={href} className='link' target="_blank">{str}</a>;
          }
        } else {
          return str;
        }
      }, this);
    }

    return this.transferPropsTo(<p className='tagged-text'>{elements}</p>);
  }
});
