(function($) {

$.fn.ensure = function(fn) {
  var args = $.makeArray(arguments),
      selector = this.selector,
      context = this.context ? $(this.context) : $('body');

  args.shift();

  if (!this[fn]) throw(fn + ' has not been defined.');

  context.bind('ensure.inserted', function(e) {
    // find matching descendent elements, including the element itself
    var elems = $(e.target).find('*').andSelf().filter(selector);

    // apply the action to all matched elements
    elems.each(function() {
      $(this)[fn].apply($(this), args);
    });
  });

  return this[fn].apply(this, args);
};

// Wrap the jQuery domManip method to apply all ensured actions
var domManip = $.fn.domManip
$.fn.domManip = function() {

  var callback = arguments[2],
      elems = arguments[0],
      alreadyOnPage = false;

  $.each(elems, function(i, elem) {
    if (elem.length) elem = elem[0];
    if (elem.parentNode) alreadyOnPage = true;
  });

  arguments[2] = function(elem) {
    var first = elem.firstChild; // don't want the document-fragment

    callback.call(this, elem);

    if (elem.nodeType != 3 && !alreadyOnPage) {
      $(first).trigger('ensure.inserted');
    }
  };

  // Call the original method
  return domManip.apply(this, arguments);
};

})(jQuery);
