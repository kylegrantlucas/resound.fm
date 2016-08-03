// Polyfill KeyEvents
window.KeyEvent = window.KeyEvent || {};
window.KeyEvent.DOM_VK_UP = KeyEvent.DOM_VK_UP || 38;
window.KeyEvent.DOM_VK_DOWN = KeyEvent.DOM_VK_DOWN || 40;
window.KeyEvent.DOM_VK_BACK_SPACE = KeyEvent.DOM_VK_BACK_SPACE || 8;
window.KeyEvent.DOM_VK_RETURN = KeyEvent.DOM_VK_RETURN || 13;
window.KeyEvent.DOM_VK_ENTER = KeyEvent.DOM_VK_ENTER || 14;
window.KeyEvent.DOM_VK_ESCAPE = KeyEvent.DOM_VK_ESCAPE || 27;