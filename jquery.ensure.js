(function($) {

$.fn.ensure = function(fn) {
  var args = $.makeArray(arguments), selector = this.selector, prevObject = this.prevObject;
  args.shift();

  var id = $.ensure.actions.push({fn:fn, args:args, selector:selector, prevObject:prevObject}) - 1;
  this.data('ensured_action_' + id, true);

  return this[fn].apply(this, args);
};

$.ensure = {
  actions: [],

  applyActions: function(elem) {
    $.each(this.actions, function(id, action) {
      $(action.prevObject).find(action.selector).each(function() {
        if (!$(this).data('ensured_action_' + id)) {
          $(this)[action.fn].apply($(this), action.args);
          $(this).data('ensured_action_' + id, true);
        }
      });
    });
  }
};

// Wrap the jQuery domManip method to apply all ensured actions
var domManip = $.fn.domManip
$.fn.domManip = function() {

  var callback = arguments[3];
  arguments[3] = function(elem) {
    callback.apply(this, [elem]);
    if (elem.nodeType != 3) $.ensure.applyActions(elem);
  };

  // Call the original method
  var r = domManip.apply(this, arguments);
  
  // Return the original methods result
  return r;
};

// Wrap the jQuery init method to expose the selector
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
