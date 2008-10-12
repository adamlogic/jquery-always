(function($) {

$.fn.ensure = function(fn) {
  var args = $.makeArray(arguments), selector = this.selector, context = this.context;
  args.shift();

  // id is the array position of this action
  var id = $.ensure.actions.push({fn:fn, args:args, selector:selector, context:context}) - 1;

  this.data('ensured_action_' + id, true);

  return this[fn].apply(this, args);
};

$.ensure = {
  actions: [],

  run: function() {
    $.each(this.actions, function(id, action) {
      $(action.selector, action.context).each(function() {
        if (!$(this).data('ensured_action_' + id)) {
          $(this)[action.fn].apply($(this), action.args);
          $(this).data('ensured_action_' + id, true);
        }
      });
    });
  }
};

// Create a new domManip method that wraps the call to run ensured actions
var domManip = $.fn.domManip
$.fn.domManip = function() {
  // Call the original method
  var r = domManip.apply(this, arguments);
  
  // Run all ensured actions
  $.ensure.run();
  
  // Return the original methods result
  return r;
};

// Create a new init method that exposes two new properties: selector and context
var init = $.prototype.init;
$.prototype.init = function(a,c) {
	// Call the original init and save the result
	var r = init.apply(this, arguments);
	
	// Copy over properties if they exist already
	if (a && a.selector)
		r.context = a.context, r.selector = a.selector;
		
	// Set properties
	if ( typeof a == 'string' )
		r.context = c || document, r.selector = a;
	
	// Return the result
	return r;
};

// Give the init function the jQuery prototype for later instantiation (needed after Rev 4091)
$.prototype.init.prototype = $.prototype;

})(jQuery);
