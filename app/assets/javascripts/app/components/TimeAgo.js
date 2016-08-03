/** @jsx React.DOM */
module.exports = React.createClass({

  displayName: 'TimeAgo',
  ticker: null,

  getDefaultProps: function() {
    return {
      date: new Date(),
      updateInterval: 5000
    };
  },

  componentDidMount: function() {
    if (!this.props.static) {
      this.ticker = setInterval(this.invalidate, this.props.updateInterval);
    }
  },

  componentWillUnmount: function() {
    if (this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null;
    }
  },

  invalidate: function() {
    this.forceUpdate();
  },

  render: function() {
    var date = this.props.date;

    if (!date instanceof Date) {
      date = new Date(date);
    }

    var formatted = moment(date).format('LLLL');
    var title = moment(date).max().fromNow();

    return this.transferPropsTo(
      React.DOM.time({ dateTime: date, title: formatted }, title)
    );
  }
});
