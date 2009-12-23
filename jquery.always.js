/*
 * jQuery Always 
 * version: 0.9
 * @requires jQuery v1.4 or later
 *
 * Examples and documentation at: http://github.com/adamlogic/jquery-always
 *
 * Copyright 2009 Adam McCrea (adam@adamlogic.com)
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {

$.fn.always = function(fn) {
  var args = Array.prototype.slice.call(arguments, 1);

  this.live('DOMInsert', function() {
    $.fn[fn].apply($(this), args);
  })
  
  return this.trigger('DOMInsert');
};


// Wrap the jQuery domManip method to trigger the DOMInsert event
var domManip = $.fn.domManip
$.fn.domManip = function() {

  var callback = arguments[2],
      elems = arguments[0],
      alreadyOnPage = false;

  $.each(elems, function(i, elem) {
    if (typeof elem == 'string') return;
    if (elem.jquery) elem = elem[0];
    if (elem.parentNode) alreadyOnPage = true;
  });

  arguments[2] = function(elem) {
    var insertedElements = selfAndAllDescendants(elem);

    callback.call(this, elem);

    if (elem.nodeType != 3 && !alreadyOnPage) {
      $(insertedElements).trigger('DOMInsert');
    }
  };

  // Call the original method
  return domManip.apply(this, arguments);
};

function selfAndAllDescendants(node) {
  nodes = [node];
  $.each(node.childNodes, function(i, child) {
    nodes = nodes.concat(selfAndAllDescendants(child));
  });
  return nodes;
}

})(jQuery);
