/** @jsx React.DOM */
var TaggedText = require('app/components/TaggedText');
var SidebarSection = require('app/components/Sidebar/SidebarSection');

module.exports = React.createClass({

  displayName: "TrendingHashtagsSidebarSection",

  buildTags: function () {
    return _.sortBy(this.props.tags, function(tag){ return -tag.post_count; })
            .reduce(function (text, tag) { return text + "#" + tag.text + " " }, "");
  },

  render: function () {
    return (this.transferPropsTo(
      <SidebarSection headerTitle="What's trending" headerLink="/trending">
        <TaggedText className="trending-hashtags" location='sidebar' text={this.buildTags()}/>
      </SidebarSection>
    ));
  }

});
