/**
 * Chainvas: Chain canvas functions and other canvas enhancements
 * @author Lea Verou
 * Credits: Mathieu Henri came up with the original idea before I did
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
	
	chainize: function(prototype) {
		for(var method in prototype) {
			if(prototype.hasOwnProperty(method) && typeof prototype[method] === 'function') {
				try {
					prototype[method] = self.chainable(prototype[method]);
				} catch(e) {}
			}
		}
	}
};

var Ctx = window.CanvasRenderingContext2D;

if(!Ctx) {
	return;
}

self.chainize(Ctx.prototype);

/**********************
 * Additional helpers 
 **********************/
 
/**
 * Set a ctx property (e.g. lineWidth or fillStyle)
 */
Ctx.prototype.set = function() {
	if(arguments.length == 1) {
		var object = arguments[0];
		
		for(var property in object) {
			if(object.hasOwnProperty(property)) {
				this[property] = object[property];
			}
		}
	}
	else if(arguments.length == 2) {
		this[arguments[0]] = arguments[1];
	}
	
	return this;
}

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