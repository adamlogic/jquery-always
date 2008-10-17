(function($) {

$.fn.ensure = function(fn) {
  var args = $.makeArray(arguments), selector = this.selector, prevObject = this.prevObject;
  args.shift();

  // id is the array position of this action
  var id = $.ensure.actions.push({fn:fn, args:args, selector:selector, prevObject:prevObject}) - 1;

  this.data('ensured_action_' + id, true);

  return this[fn].apply(this, args);
};

$.ensure = {
  actions: [],

  run: function() {
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

// Create a new find method that exposes the most recent selector used
// (find is called inside $(selector))
var find = $.fn.find;
$.fn.find = function(selector) {
	// Call the original find and save the result
	var r = find.apply(this, arguments);
	
  r.selector = selector;
	
	return r;
};

})(jQuery);
