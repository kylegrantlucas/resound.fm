var TooltipMixin = {

  componentDidMount: function() {
    var el = this.getDOMNode();

    el.addEventListener('mouseenter', this.mouseenter, false);
    el.addEventListener('mouseleave', this.mouseleave, false);
  },

  componentDidUpdate: function() {
    // We only care if the tooltip is shown and we are the owner.
    if (!gTooltip.hidden && gTooltipOwner === this && this.tooltipContent && this.tooltipContent()) {
      this.update(this.tooltipContent());
    }
  },

  componentWillUnmount: function() {
    var el = this.getDOMNode();

    el.removeEventListener('mouseenter', this.mouseenter);
    el.removeEventListener('mouseleave', this.mouseleave);
  },

  mouseenter: function() {
    // Assert ownership on mouseenter
    gTooltipOwner = this;

    if (this.tooltipContent && this.tooltipContent()) {
      this.update(this.tooltipContent());
    }
  },

  mouseleave: function() {
    // Hide the tooltip only if we are still the owner.
    if (gTooltipOwner === this) {
      gTooltip.detach().hide();
      gTooltipOwner = null;
    }
  },

  update: function(content) {
    var el = this.getDOMNode();
    React.renderComponent(content, gTooltip.element, function() {
      // Need to tell the tooltip that its contents have changed so
      // it can reposition itself correctly.
      gTooltip.attach(el).show().updateSize().place('top');
    });
  }

};

module.exports = TooltipMixin;