/**
 * Chainvas: Chaining for everyone!
 * @author Lea Verou
 * MIT license http://www.opensource.org/licenses/mit-license.php
 */

(function(){

var self = window.Chainvas = {
	// Make a method chainable
	chainable: function(method) {
		return function() {
			var ret = method.apply(this, arguments)

			return ret === undefined? this : ret;
		}
	},
	
	// Chainablize one existing method
	chainablizeOne: function(prototype, method) {
		try {
			if(self.utils.hasOwnProperty(prototype, method) 
			  && self.utils.isFunction(prototype[method])) {
				prototype[method] = self.chainable(prototype[method]);
			}
		} catch(e) {}
		
		return this;
	},
	
	// Chainablize existing methods
	chainablize: function(constructor, restricted) {
		var prototype = constructor.prototype;
		
		if(restricted) {
			for(var i=restricted.length; i--;) {
				self.chainablizeOne(prototype, restricted[i]);
			}
		}
		else {
			for(var method in prototype) {
				self.chainablizeOne(prototype, method);
			}
		}
		
		return this;
	},
	
	// Add extra helpers
	helpers: function(constructor, extras) {
		var prototype = constructor.prototype;
		
		for(var method in self.methods) {
			if(prototype && !(method in prototype)) {
				prototype[method] = self.methods[method];
			}
		}
		
		self.extend(prototype, extras);
		
		return this;
	},
	
	// Helper function that works like jQuery.extend
	extend: function(o, properties) {
		return Chainvas.methods.prop.call(o, properties);
	},
	
	// Takes an array of global constructor names and chainablizes, adds helpers etc
	global: function(constructors, extras, restricted) {
		if(typeof constructors === 'string') {
			constructors = [constructors];
		}
		
		for(var i=constructors.length; i--;) {
			var constructor = window[constructors[i]];
			
			if(constructor) {
				self.chainablize(constructor, restricted)
				    .helpers(constructor, extras);
			}
		}
	},
	
	// Generic methods that make working with chainablized objects easier
	methods: {
		// Generic chainable method for setting properties
		prop: function() {
			if (arguments.length === 1) {
				var object = arguments[0];
				
				for(var property in object) {
					this[property] = object[property];
				}
			}
			else if (arguments.length === 2) {
				this[arguments[0]] = arguments[1];
			}
			
			return this;
		}
	},
	
	utils: {
		// IE8 misreports host object methods as objects
		isFunction: function(fn) {
			var cl = Object.prototype.toString.call(fn);
			
			return cl === '[object Function]' ||
				(cl === '[object Object]' &&
					('call' in fn) && ('apply' in fn) &&
					/^\s*\bfunction\s+\w+\([\w,]*\) \{/.test(fn + '')
				);
		},
		
		// going the regular way throws errors in IE8 on host objects
		hasOwnProperty: function(obj, prop) {
			try {
				return obj.hasOwnProperty(prop);
			}
			catch(e) {
				return (prop in obj) &&
					(!obj.prototype
						|| !(prop in obj.prototype)
						|| (obj.prototype[prop] !== obj[prop])
					);
			}
		}
	}
};


})();

/**
 * Chainvas module: DOM
 */
(function(){

var interfaces = ['CSSStyleDeclaration', 'DOMTokenList', 'Node', 'Element'];

// Firefox bug
if (window.HTMLElement 
	&& 'addEventListener' in window.HTMLElement.prototype 
	&& window.Components 
	&& window.Components.interfaces) {
	for(var p in Components.interfaces) {
		if(p.match(/^nsIDOMHTML\w*Element$/)) {
			var inyourface = p.replace(/^nsIDOM/, '');
			
			if(window[inyourface]) {
				interfaces.push(inyourface);
			}
		}
	}
}

Chainvas.global(interfaces);

})();

/**
 * Chainvas module: Canvas
 */
Chainvas.global('CanvasRenderingContext2D', {
	circle: function(x, y, r) {
		return this.beginPath().arc(x, y, r, 0, 2*Math.PI, false).closePath();
	},
	
	roundRect: function(x, y, w, h, r) {
		return this.beginPath().moveTo(x + r, y)
		  .lineTo(x + w - r, y).quadraticCurveTo(x + w, y, x + w, y + r)
		  .lineTo(x + w, y + h - r).quadraticCurveTo(x + w, y + h, x + w - r, y + h)
		  .lineTo(x + r, y + h).quadraticCurveTo(x, y + h, x, y + h - r)
		  .lineTo(x, y + r).quadraticCurveTo(x, y, x + r, y)
		  .closePath();
	}
});

/**
 * Chainvas module: CanvasGradient
 */
Chainvas.global('CanvasGradient');

