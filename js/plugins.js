var UTILS = (function () {

	return {
		/**
		 * Check if a given value is a plain Object
		 *
		 * @param  {*}       o Any value to be checked
		 * @return {Boolean}   true if it's an Object
		 */
		isObject: function (o) {
			var toString = Object.prototype.toString;
			return (toString.call(o) === toString.call({}));
		},

		addEvent: function(elem, type, handler) {
			if(window.addEventListener) // modern browsers including IE9+
			{ 
	            elem.addEventListener(type, handler, false);
	        }
	        else if(window.attachEvent) // IE8 and below
	        { 
	            elem.attachEvent('on' + type, handler);
	        }
	        else
	        {
	            elem['on' + type] = handler;
	        }
		},

		removeEvent: function(elem, type, handler) {
			if(window.removeEventListener) // modern browsers including IE9+
			{
	            elem.removeEventListener(type, handler, false);
	        }
	        else if(window.detachEvent) // IE8 and below
	        {
	            elem.detachEvent('on' + type, handler);
	        }
	        else
	        {
	            elem['on' + type] = null; 
	        }	
		}


    
	};
}());
