# chainvas
## A better canvas helper

**chainvas** is an extra lightweight library that adds chaining and various helper methods to the canvas API

## Documentation

### Chaining
**chainvas** alters the native methods on the canvas’ context, so that they are chainable, allowing you to do things like this:

	ctx.beginPath()
		.set({
			lineWidth: 2,
			strokeStyle: '#333'
		}).moveTo(0,0)
		.bezierCurveTo(50,50, 80,80, 100,100)
		.stroke().closePath();

### Helper methods
	set(values)
	set(property, value)
Helpful for setting properties like `lineWidth`, `strokeStyle` etc in a more readable way and without  breaking the code chain.

	circle(x, y, radius)
Draws a circle. You still have to call `stroke()` or `fill()` to actually display it.

	roundRect(x, y, width, height, radius)
Draws a rounded rectangle. You still have to call `stroke()` or `fill()` to actually display it.

## How does it work?
**chainvas** adds methods to the prototype of `CanvasRenderingContext2D` (the object you get when you call `canvas.getContext('2d')` is a `CanvasRenderingContext2D` object) and replaces the existing ones with a wrapper that calls the original function and returns `this` if and only if the function didn't return `undefined`. It automatically detects which methods are present, which saves filesize and makes it much more flexible.

Also, most of the code is written in a generic way, so you can use it to make other APIs chainable, even if completely unrelated to &lt;canvas&gt;. There is a global object `Chainvas`, with the following methods:

	Chainvas.chainable(method)
Accepts a function and returns a function that does the same thing but is chainable (=returns its context instead of `undefined`)

	Chainvas.chainize(prototype)
Accepts an object's prototype, iterates through all of its own methods and makes them chainable. If overwriting a method throws an error, it will move on without failing.