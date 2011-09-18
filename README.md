# chainvas
## Chaining for every API

**chain•vas** |chānvəs| *n.* A tiny, modular library that can add chaining to any API that isn't naturally chainable, like the Canvas API, the DOM and more.

## How does it work?
**chainvas** goes through all the methods in a prototype and wraps a function around them that returns the returned value or, if that is `undefined`, the function's context (`this`). Since the function context is our original object, we can keep calling methods without having to write the variable name over and over again, like this:

	obj.foo().bar().baz();

instead of this:

	obj.foo();
	obj.bar();
	obj.baz();

This practice is usually called **chaining** and was popularized by [jQuery](http://jquery.com/) back in 2006. If you find the first code example harder to read than the second, keep in mind that you can format it like this:

	obj
	  .foo()
	  .bar()
	  .baz();

which not only saves you the extra bytes and typing, but is also much easier to read than both of the previous examples.

**chainvas** also optionally adds a few helper methods (currently only one at the Core level, `.prop()`) to make chaining easier. For details about all this, read the Documentation below.

**chainvas**' Core does not modify any existing objects. There are some official modules that are optionally supplied with it which do so, for a number of different APIs. However, if you feel uneasy about modifying existing prototypes, you can just download the extra lightweight Core and use it in a custom way.

## Documentation

### Chainvas Core

#### `Chainvas.chainable(method)`[Chainvas.chainable]
This function accepts a function as a parameter and returns a function that's the same, with the only difference that it returns `this` in cases when it was going to return `undefined`, essentially making it chainable.

#### `Chainvas.chainablizeOne(prototype, method)`[Chainvas.chainablizeOne]
This function accepts a prototype object and a method name (string) and makes that method chainable, if and only if it's already present on the prototype (in other words, you can't use it to add extra methods to it). This function is useful for more conservative developers that don't want to alter the APIs too much, but only use that convenience for a couple methods they use most often.

#### `Chainvas.chainablize(constructor [, restricted])`[Chainvas.chainablize]
This function is similar to `Chainvas.chainablizeOne()`, but it's intended for more methods instead of just one or two. If the second argument is not used, it will loop through all the prototype's methods and make them all chainable. If you want to restrict that behavior to only a subset of methods, you can pass an array with method names (strings) as its second parameter.

Please note that the first parameter is **the constructor, not the prototype**. In other words, if you wanted to chainablize `Array`, you would use `Chainvas.chainablize(Array)` and not `Chainvas.chainablize(Array.prototype)`. However, since `Array` is naturally quite chainable, it makes sense to only chainablize one or two methods, for example `forEach`. In this case, you would use `Chainvas.chainablizeOne(Array.prototype, 'forEach')`

#### `Chainvas.helpers(constructor [, extras])`[Chainvas.helpers]
This function adds both the [Chainvas core methods][chainvas-core-methods] along with any extra helpers you might want to add. Note that your helpers will have to return `this` themselves, as they won't be wrapped. It's just a shortcut for `Foo.prototype.myExtra = function() {...}`. For an example of using `Chainvas.helpers` with extras, check the source of the Canvas module.

#### `Chainvas.global(constructorNames [, extras [, restricted]])`[Chainvas.global]
This is a convenience function for chainablizing and adding helpers to one or more global constructors.  You pass in the **names** of the constructors as either a string or an array of strings. For example `'Node'`, `'Element'` or `['Node', 'Element']` for both.

The `extras` parameter works the same as it does for [Chainvas.helpers][Chainvas.helpers] and the `restricted` parameter is the same as in [Chainvas.chainablize][Chainvas.chainablize].

Of course, all the Chainvas methods are chainable themselves as well, so you can do stuff like:

	Chainvas.chainablize(...).helpers(...);

### Chainvas core methods[chainvas-core-methods]
The following methods will be added to every prototype when `Chainvas.helpers` is called on its constructor:

	obj.prop(values)
	obj.prop(property, value)
Helpful for setting properties (like `lineWidth`, `strokeStyle` etc in canvas contexts) in a more readable way and without  breaking the code chain.

You might be wondering why there's no `prop(property)` for getting values. However, that would be redundant, since in our case we can just do `object.foo` instead of `object.prop('foo')`.

You can also use this method to set multiple properties on every object, by using `Chainvas.methods.prop.call(obj, properties)` or `Chainvas.extend(obj, properties)` which is a shortcut to that.

And that's all for now. You can suggest methods to add, but I'm very conservative about adding new methods to **every** chainablized prototype, so it has to be super-useful and with low chances or collisions, like `prop`. If it's only useful for a certain case, add it to that module instead, through the `extras` parameter in `Chainvas.helpers`.

### DOM module[DOM-module]
The **Chainvas DOM module** makes the following chainable:

* DOM methods on elements, allowing you to do amazing things like:

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
* Style objects, allowing you to do stuff like:

		var css = document.body.style.prop({
			color: '#245',
			fontFamily: 'Georgia, serif',
			textDecoration: 'underline'
		}).removeProperty('text-decoration')
		.cssText;
* `classList` methods, allowing you to do things like:

		element.classList
			.add('foo')
			.add('bar')
			.toggle('baz');
when `classList` is supported.

It does not add any extra helpers (besides the [Chainvas code methods][chainvas-core-methods] of course).

### Canvas module[Canvas-module]
The **Chainvas Canvas module** alters the native methods on the canvas context, so that they are chainable, allowing you to do things like this:

	ctx.beginPath()
		.prop({
			lineWidth: 2,
			strokeStyle: '#333'
		}).moveTo(0,0)
		.bezierCurveTo(50,50, 80,80, 100,100)
		.stroke().closePath();

It also adds the following helper methods:

	circle(x, y, radius)
Draws a circle. You still have to call `stroke()` or `fill()` to actually display it.

	roundRect(x, y, width, height, radius)
Draws a rounded rectangle. You still have to call `stroke()` or `fill()` to actually display it.

## Browser support
**Chainvas core** has been tested and found to work in:

* Chrome
* Firefox 3.6+
* Opera 10+
* Safari 4+
* IE6+ (yes, IE6!) 

Of course, the individual Chainvas modules have different browser support than the core. For example, the [Chainvas DOM module][DOM-module] won't work in IE7 or below, since it doesn't expose the DOM interfaces and the [Chainvas Canvas module][Canvas-module] won't work in any browser that doesn't support canvas. Here's the browser support information for the built-in modules:

### DOM module
* Chrome
* Firefox 3.6+*
* Opera 10+
* Safari 4+
* IE8+

\* Except for `addEventListener` prior to Firefox 4, due to [this bug](https://bugzilla.mozilla.org/show_bug.cgi?id=456151)

### Canvas module
Every browser that supports canvas.

Just because an older version isn't listed above, doesn't mean Chainvas doesn't work in it. It just means I haven't tested in it. You can run [the unit tests](unit-tests.html) in your browsers and operating systems and let me know.

## Making your own modules[making-your-own-modules]
Making new modules is super easy. Modules are essentially pieces of code added in `chainvas.js` through comments like this:

	/**
	 * Chainvas module: Your module id
	 */

Then, the build script splits chainvas.js where these comments are. Module ids can contain letters, numbers, spaces, hyphens or underscores (_). Please note that these comments have to also be present in the minified `chainvas.min.js` file, even though they're not included in the built minified file.

So, you can fork the [Chainvas repo on github](https://github.com/LeaVerou/chainvas), add your module and send a pull request.

## FAQ

### Isn't modifying host objects bad?
In the general case, yes it is. However, most arguments against it, don't really apply to what Chainvas does. Besides, **Chainvas core doesn't modify any existing objects**, so it's up to you which extra modules to use, if any. Most counter-arguments below apply to the Chainvas modules that modify host objects (like the [DOM module][DOM-module]), not the Chainvas core itself.

Kangax has written [an extensive article against the practice of modifying host objects](http://perfectionkills.com/whats-wrong-with-extending-the-dom/) which is commonly mentioned in relevant discussions. This article was written years ago and while it was great advice at that time, some of its points don't really apply nowadays. And the ones that do, don't apply to Chainvas. Lets tackle his arguments one by one:

* [Lack of specification](http://perfectionkills.com/whats-wrong-with-extending-the-dom/#lack_of_specification): Yes, there is no official requirement that browsers expose these interfaces. However, the fact is that every browser currently in use does so, except old IEs (< 8). `innerHTML` and a bunch of other commonly used stuff wasn't required to be there by any spec either up to a while ago, but everyone still used it.
* [Host objects have no rules](http://perfectionkills.com/whats-wrong-with-extending-the-dom/#host_objects_have_no_rules): This is similar to the first one. Yes, they are not required to do anything by the specifications, but fact is, they behave quite consistently in practice. Most of the issues that kangax mentions are found in old IEs, which now have a tiny market share and Chainvas doesn't even support, and they're not about the prototypes, but instances themselves. Chainvas doesn't attempt to do manual extension on any instances, only on prototypes.
* [Chance of collisions](http://perfectionkills.com/whats-wrong-with-extending-the-dom/#chance_of_collisions): This is IMHO the most valid argument, and the reason you should be **very conservative** when using [`Chainvas.helpers`][Chainvas.helpers]. However, in chainablizing existing methods, this point is moot, since they already exist there.
* [Performance overhead](http://perfectionkills.com/whats-wrong-with-extending-the-dom/#performance_overhead): Again, a very good point in general, but Chainvas does not manually extend any *instances*. There *is* a very slight performance overhead introduced by wrapping the native methods, which you can reduce even further by using the `restricted` parameter in [Chainvas.chainablize][Chainvas.chainablize] to limit which methods become chainable. However, this has the disadvantage of bloating your code with extra bytes and making it less future-proof, which is why it's not used by default in the official Chainvas modules.
* [IE DOM is a mess](http://perfectionkills.com/whats-wrong-with-extending-the-dom/#ie_dom_is_a_mess): Again, this is only about manual extension, which Chainvas does not do.
* [Browser bugs](http://perfectionkills.com/whats-wrong-with-extending-the-dom/#bonus_browser_bugs): The mentioned bugs are only relevant for IE8 now, browsers like Safari 3 have faded into obscurity. And those IE8 bugs do not affect what the Chainvas DOM module does at all.

Another argument that people commonly use is that *"modifying host objects makes their behavior unpredictable and breaks existing scripts"*. This is very true for some cases: You should never, for example, modify a native method to do what you think it should, instead of what it actually does. However, the only thing that Chainvas changes in native methods is that they return `this` instead of `undefined`. Can you name any real use case where a script breaks if a native method doesn't return `undefined`? Neither can I. Because we usually don't even store the return value of these methods, let alone do something useful with it.

### What's up with all the canvas references?
Chainvas originally started as a library to make the Canvas API chainable. I realized afterwards that its potential is much more than that, so I made it more generic and split all the Canvas-related functionality to just an extra module.

### I love Chainvas! How can I help?

* You can help make it better, by [writing new modules][making-your-own-modules]
* You can run the [unit tests](unit-tests.html) in your environment and let me know about the results
* You can show your Chainvas love by linking to this page and/or using the following graphic (SVG):
![Made with care and chainvas](/img/madewith.svg)