/**
 * Chainvas: Make APIs chainable and enhance the canvas API
 * @author Lea Verou
 * MIT license http://www.opensource.org/licenses/mit-license.php
 */

(function(){

var self = window.Chainvas = {
	chainable: function(method) {
		return function() {
			var ret = method.apply(this, arguments)
			return ret === undefined? this : ret;
		}
	},
	
	chainablize: function(constructor) {
		var prototype = constructor.prototype;
		
		// Chainablize existing methods
		for(var method in prototype) {
			try {
				if(prototype.hasOwnProperty(method) && typeof prototype[method] === 'function') {
					prototype[method] = self.chainable(prototype[method]);
				}
			} catch(e) {}
		}
		
		// Add extra helpers
		for(var method in self.methods) {
			if(!(method in prototype)) {
				try {
					prototype[method] = self.methods[method];
				} catch(e) {}
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
					if(object.hasOwnProperty(property)) {
						this[property] = object[property];
					}
				}
			}
			else if (arguments.length === 2) {
				this[arguments[0]] = arguments[1];
			}
			
			return this;
		}
	}
};

// It's all about <canvas> from now on

var Ctx = window.CanvasRenderingContext2D;

if(!Ctx) {
	return;
}

self.chainablize(Ctx);

Ctx.prototype.circle = function(x, y, r) {
	return this.beginPath().arc(x, y, r, 0, 2*Math.PI, false).closePath();
}

Ctx.prototype.roundRect = function(x, y, w, h, r) {
	return this.beginPath().moveTo(x + r, y)
	  .lineTo(x + w - r, y).quadraticCurveTo(x + w, y, x + w, y + r)
	  .lineTo(x + w, y + h - r).quadraticCurveTo(x + w, y + h, x + w - r, y + h)
	  .lineTo(x + r, y + h).quadraticCurveTo(x, y + h, x, y + h - r)
	  .lineTo(x, y + r).quadraticCurveTo(x, y, x + r, y)
	  .closePath();
}
  
})();