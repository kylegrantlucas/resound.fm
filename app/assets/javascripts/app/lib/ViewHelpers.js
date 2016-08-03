module.exports = {

  showIf: function (condition, el) {
    if (condition) {
      return el;
    }

    return null;
  },

  showIfElse: function (condition, ifEl, elseEl) {
    if (condition) {
      return ifEl;
    }
    else {
      return elseEl;
    }
  },

  // TODO: should probably look into replacing this with something more robust in the future (maybe: http://airbnb.github.io/polyglot.js/)
  dumbPluralize: function(word, count) {
    return (count === 1) ? word : (word + "s");
  },

  isFirefox: function () {
    try {
      return /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
    } catch (e) {
      return false;
    }
  },

  getCursorPos: function (el) {
    if (el.selectionStart) {
      return el.selectionStart;
    } else if (document.selection) {
      el.focus();

      var r = document.selection.createRange();
      if (r == null) {
        return 0;
      }

      var re = el.createTextRange(),
          rc = re.duplicate();
      re.moveToBookmark(r.getBookmark());
      rc.setEndPoint('EndToStart', re);

      return rc.text.length;
    }
    return 0;
  },

  getOffsetRect: function (elem) {
      var box = elem.getBoundingClientRect();
      var body = document.body;
      var docElem = document.documentElement;

      var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

      var clientTop = docElem.clientTop || body.clientTop || 0;
      var clientLeft = docElem.clientLeft || body.clientLeft || 0;

      var top  = box.top +  scrollTop - clientTop;
      var left = box.left + scrollLeft - clientLeft;

      return { top: top, left: left }
  }

};
