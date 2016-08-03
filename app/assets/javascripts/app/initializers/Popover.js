// Patch Bootstrap popover to take a React component instead of a
// plain HTML string
$.extend($.fn.popover.Constructor.DEFAULTS, {react: false});
var oldSetContent = $.fn.popover.Constructor.prototype.setContent;
$.fn.popover.Constructor.prototype.setContent = function() {
  if (!this.options.react) {
    return oldSetContent.call(this);
  }

  var $tip = this.tip();
  var title = this.getTitle();
  var content = this.getContent();

  $tip.removeClass('fade top bottom left right in');

  // If we've already rendered, there's no need to render again
  if (!$tip.find('.popover-content').html()) {
    // Render title, if any
    var $title = $tip.find('.popover-title');
    if (title) {
      React.renderComponent(title, $title[0]);
    } else {
      $title.hide();
    }

    React.renderComponent(
      content,
      $tip.find('.popover-content')[0]
    );
  }
};

$(document).on('click', function (e) {
  $('.popover-link').each(function () {
    //the 'is' for buttons that trigger popups
    //the 'has' for icons and other elements within a button that triggers a popup
    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
      $(this).popover('hide');
      return;
    }
  });
});