/** @jsx React.DOM */

var PopoverTrigger = require('app/components/Popover/PopoverTrigger');
var PopoverContent = require('app/components/Popover/NewPopover');

module.exports = React.createClass({

  getInitialState: function() {
    return {
      popoverVisible: false
    };
  },

  togglePopover: function(e) {
    e.preventDefault();
    this.setState({popoverVisible: !this.state.popoverVisible});

    // Call onOpen callback
    if(this.state.popoverVisible && this.props.onOpen) {
      this.props.onOpen();
    }

    // Call onClose callback
    else if(!this.state.popoverVisible && this.props.onClose) {
      this.props.onClose();
    }
  },

  closePopover: function(e) {
    if (this.isMounted()) {
      this.setState({popoverVisible: false});
      if(this.props.onClose)
        this.props.onClose();  
    }
  },

  componentDidMount: function() {
    $(document).on(('click.' + this.props.popoverID), this.handleDocumentClick);
    $(document).on(('closeAllPopovers'), this.closePopover);
  },

  componentWillUnmount: function() {
    $(document).off('click.' + this.props.popoverID);
  },

  handleDocumentClick: function (e) {
    var $target = $(e.target);

    // Check if click was somewhere inside a popover-link
    if($target.hasClass('popover-link') || ($target.parents('.popover-link').length > 0)) {
      
      // Get the parent link
      var popoverLink;
      if($target.hasClass('popover-link')) {
        popoverLink = $target;
      }
      else {
        popoverLink = $target.parents('.popover-link')[0];
      }

      // If the popover link is not our own, close all other popovers
      // TODO: There could be a potential race condition here depending on how the click events are bound
      if(!$(popoverLink).hasClass(this.props.popoverID)) {
        this.setState({
          popoverVisible: false
        });
        return;   
      }

      // Otherwise it's our own popover-link so we'll ignore the click
      return;
    }
    // If the click is inside of the popover content itself we'll ignore the click too
    else if ($target.is(this.getDOMNode()) || ($(this.getDOMNode()).has(e.target).length > 0)) {
      return;
    }
    // If the click was anywhere else, we'll close all popovers
    else {
      this.setState({
        popoverVisible: false
      });      
    }
  },

  render: function() {
    
    // Build classes string
    var wrapperClasses = this.props.popoverID + ' popover-wrapper';
    if(this.props.className)
      wrapperClasses += ' ' + this.props.className;

    return (
      <div className={wrapperClasses}>
        <PopoverTrigger onClick={this.togglePopover} popoverID={this.props.popoverID}>{this.props.popoverTriggerContent}</PopoverTrigger>
        <PopoverContent visible={this.state.popoverVisible} position={this.props.popoverPosition} popoverID={this.props.popoverID}>
          {React.addons.cloneWithProps(this.props.popoverContent, {visible: this.state.popoverVisible})}
        </PopoverContent>     
      </div>
    );
  }
});