# chainvas
## Chaining for every API

**chainvas** is a tiny library that adds chaining and various helper methods to the canvas API. Additionally, it can make every API chainable.

## How does it work?
**chainvas** adds methods to the prototype of `CanvasRenderingContext2D` (the object you get when you call `canvas.getContext('2d')` is a `CanvasRenderingContext2D` object) and replaces the existing ones with a wrapper that calls the original function and returns `this` if and only if the function originally returned `undefined`. It automatically detects which methods are present, which saves filesize and makes it much more flexible.

Also, most of the code is written in a generic way, so you can use it to make other APIs chainable, even if completely unrelated to &lt;canvas&gt;. There is a global `Chainvas` object, with the following methods:

	Chainvas.chainable(method)
Accepts a function and returns a function that does the same thing but is chainable (=returns its context instead of `undefined`)

	Chainvas.chainablize(prototype)
Accepts an object's prototype, iterates through all of its own methods and makes them chainable. It also adds [a few extra helpers](#extrahelpermethods), if no methods with the same name are already defined. If overwriting a method throws an error, it will move on without failing.

## Documentation

### Chaining
**chainvas** alters the native methods on the canvas’ context, so that they are chainable, allowing you to do things like this:

	ctx.beginPath()
		.prop({
			lineWidth: 2,
			strokeStyle: '#333'
		}).moveTo(0,0)
		.bezierCurveTo(50,50, 80,80, 100,100)
		.stroke().closePath();

### Extra helper methods

#### Generic helpers
The following methods will be added to every "chainabl-ized" prototype.

	prop(values)
	prop(property, value)
Helpful for setting properties (like `lineWidth`, `strokeStyle` etc in canvas contexts) in a more readable way and without  breaking the code chain.

You might be wondering why there's no `prop(property)` for getting values. However, that would be redundant, since in our case we can just do `object.foo` instead of `object.prop('foo')`.

#### Canvas helpers
The following methods are only useful for canvas, so they’re only added to `CanvasRenderingContext2D`.

	circle(x, y, radius)
Draws a circle. You still have to call `stroke()` or `fill()` to actually display it.

	roundRect(x, y, width, height, radius)
Draws a rounded rectangle. You still have to call `stroke()` or `fill()` to actually display it.

## Browser support
**Chainvas** is essentially an alpha (or an early beta, dunno, everyone seems to define those differently). I haven't done much browser testing yet. I know for a fact it works in modern versions of **Firefox**, **Chrome** and **Opera** on **OSX**. But beyond that... I have no idea. I don't see a reason why it wouldn't work in others, but there is always the possibility of bugs preventing it to do so. And this is where you come in: You can test it in your browsers and operating systems and let me know. I'm planning to publish some unit tests soon, so that it's even easier to help with testing.

## Examples

### Making the DOM chainable
You don't need jQuery just to be able to chain DOM methods. You can just do this:

	Chainvas.chainablize(Node.prototype)
	Chainvas.chainablize(Element.prototype)

Don't worry about potential redundancy about doing it for both `Node` and `Element`. **Chainvas** checks whether the method is actually an own property of the prototype, so any given method can only belong to one of them.

Then you can start doing amazing things like this:

	document.body.appendChild(
		document.createElement('a')
			.prop({
				'href': 'http://leaverou.me',
				'innerHTML': 'Lea Verou',
				'title': 'Visit this awesome blog!',
				'onclick': function(evt){ alert('gotcha!'); }
			})
			.setAttribute('data-unicorns', '42')
			.addEventListener('mouseover', function(){ alert('don’t do this')}, false)
	);
Feel free to try it on this page, it has `chainvas.js` loaded already (Don't forget to run the `chainablize` lines first!).

The code above won't work in **Firefox** because it currently has [a bug](https://bugzilla.mozilla.org/show_bug.cgi?id=686210) and it specifies native DOM methods like `addEventListener` or `setAttribute` in **every** prototype below `Node`. So, if you want to chain these methods, you have to do it for the most specific interface available. For example, if it's a link, you have to chainablize `HTMLAnchorElement` too, which makes it very impractical. :(

### Making style objects chainable
You first chainablize `CSSStyleDeclaration` objects:

	Chainvas.chainablize(CSSStyleDeclaration.prototype);

And then, you can do stuff like:

	var css = document.body.style.prop({
		color: '#245',
		fontFamily: 'Georgia, serif',
		textDecoration: 'underline'
	}).removeProperty('text-decoration')
	.cssText;

You can try it in the console right now, and check the results out ;)