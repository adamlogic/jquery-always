(function($) {

$.fn.ensure = function(fn) {
  var args = $.makeArray(arguments), 
      selector = this.selector,
      context = (this.prevObject && this.prevObject.parents().length) ? this.prevObject : $('body');
  args.shift();

  if (!this[fn]) throw('ensure only supports defined jquery methods - "' + fn + '" was attempted.');
  if (selector.match(/\w /)) throw('ensure only supports simple selectors - "' + selector + '" was attempted.');

  context.bind('ensure.run', function(e, elem) {
    $.each(selector.split(','), function(i, selector) {
      // find descendent elements
      var elems = elem.find(selector);

      // include the element itself
      if (elem.filter(selector).length) elems = elems.andSelf();

      // apply the action to all matched elements
      elems.each(function() {
        $(this)[fn].apply($(this), args);
      });
    });
  });

  return this[fn].apply(this, args);
};

// Wrap the jQuery domManip method to apply all ensured actions
var domManip = $.fn.domManip
$.fn.domManip = function() {

  var callback = arguments[3], self = this;

  arguments[3] = function(elem) {
    var alreadyOnPage = elem.parentNode && elem.parentNode.parentNode;

    callback.apply(this, [elem]);

    if (elem.nodeType != 3 && !alreadyOnPage) {
      // parents() will be unnecessary if/when jquery supports custom event bubbling
      self.parents().andSelf().trigger('ensure.run', [$(elem)]);
    }
  };

  // Call the original method
  return domManip.apply(this, arguments);
};

// Wrap the jQuery find method to expose the most recent selector used
// (find is called inside $(selector))
var find = $.fn.find;
$.fn.find = function(selector) {
  // Call the original find and save the result
  var r = find.apply(this, arguments);
       
  r.selector = selector;

  return r;
};

// Wrap the jQuery init method to expose the selector
// (necessary because find is not called for $(#id))
var init = $.prototype.init;
$.prototype.init = function(selector, context) {
	// Call the original init and save the result
	var r = init.apply(this, arguments);
	
  r.selector = selector

	return r;
};

// Give the init function the jQuery prototype for later instantiation (needed after Rev 4091)
$.prototype.init.prototype = $.prototype;

})(jQuery);
