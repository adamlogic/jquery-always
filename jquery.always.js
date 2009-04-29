/*
 * jQuery Always 
 * version: 0.1
 * @requires jQuery v1.3 or later
 *
 * Examples and documentation at: http://github.com/adamlogic/jquery-always
 *
 * Copyright 2009 Adam McCrea (adam@adamlogic.com)
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function($) {

$.fn.always = function() {
  return new $.always.init(this);
};

$.always = {};
$.always.init = function(original) {
  this.selector = original.selector,
  this.context = original.context ? $(original.context) : $('body');
  this.original = original;
};

$.always.registerFunction = function(functionName) {
  $.always.init.prototype[functionName] = function() {
    var selector = this.selector,
        args = arguments;

    this.context.bind('always.inserted', function(e) {
      // find matching descendent elements, including the element itself
      var elems = $(e.target).find('*').andSelf().filter(selector);

      // apply the action to all matched elements
      elems.each(function(i, elem) {
        $.fn[functionName].apply($(elem), args);
      });
    });

    $.fn[functionName].apply(this.original, args);

    return this;
  }
};

$(function() {
  for (var functionName in $.fn) {
    $.always.registerFunction(functionName);
  }
});

// Wrap the jQuery domManip method to trigger the always.inserted event
var domManip = $.fn.domManip
$.fn.domManip = function() {

  var callback = arguments[2],
      elems = arguments[0],
      alreadyOnPage = false;

  $.each(elems, function(i, elem) {
    if (typeof elem == 'string') return;
    if (elem.length) elem = elem[0];
    if (elem.parentNode) alreadyOnPage = true;
  });

  arguments[2] = function(elem) {
    var insertedElements = $(elem.childNodes); // elem is a document-fragment

    callback.call(this, elem);

    if (elem.nodeType != 3 && !alreadyOnPage) {
      insertedElements.trigger('always.inserted');
    }
  };

  // Call the original method
  return domManip.apply(this, arguments);
};

})(jQuery);
