function assert(id, tests) {
	var f = document.createDocumentFragment(),
		h2 = document.createElement('h2'),
		ul = document.createElement('ul');
	
	if (!assert.i) assert.i = 0;
	
	h2.innerHTML = id;
	h2 = f.appendChild(h2);
	
	ul.className = 'tests';
	ul = f.appendChild(ul);
	
	document.body.appendChild(f)
	
	for(var test in tests) {
		(function(test) {
		setTimeout(function() {
			var li = document.createElement('li');
			
			try {
				var results = tests[test]();
				
				if(typeof results === 'boolean') {
					var pass = results;
				}
				else {
					var failed = 0;
					
					for(var i=0; i<results.length; i++) {
						if(results[i] === false) {
							failed++;
						}
					}
					
					var pass = !failed;
				}
				
				li.className = pass? 'pass' : 'fail';
				li.title = '(' + li.className + ')\r\n' + tests[test];
			}
			catch (e) {
				li.className = 'error';
				li.title = 'Error on line ' + (e.lineNumber || 'N/A') + ':\r\n' + e;
			}
			
			li.innerHTML = test + (failed? ' (' + failed + '/' + results.length + ' failed)' : '');
			
			ul.appendChild(li)
		}, ++assert.i * 10)
		})(test)
	}
}