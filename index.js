/**
 * Manage downloads
 */
(function() {

var form = document.getElementsByTagName('form')[0],
	p = form.getElementsByTagName('p')[1],
	a = form.getElementsByTagName('a')[0],
	code;

form.elements.compression[0].onclick = 
form.elements.compression[1].onclick = function() {
	var minified = +this.value;
	
	p.innerHTML = p.firstChild.textContent + '<progress></progress>';
	form.className = 'open';
	
	// Download chainvas.js through XHR
	var xhr = new XMLHttpRequest();
	
	code = {};
	
	xhr.open('GET', 'chainvas' + (minified? '.min' : '') + '.js', true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState === 4) {
			if(xhr.status === 200 || xhr.status === 304) {
				p.innerHTML = p.firstChild.textContent;
				
				window.chainvasjs = xhr.responseText;
				
				// Split into modules
				var moduleHeader = /(\/\*\*\s+\* Chainvas module: ([\w -]+?)\s+\*\/)/gim,
					parts = chainvasjs.split(moduleHeader);
					
				moduleHeader = RegExp(moduleHeader.source, 'i');
				
				for(var i=0; i<parts.length; i++) {
					var part = parts[i];
					
					if(moduleHeader.test(part)) {
						var id = parts[i+1];
						
						code[id] = {	
							code: (minified? '' : part) + parts[i+2]
						}
					}
					else if (i === 0) {
						var id = 'Core';
						
						code[id] = {
							code: parts[i]
						}
					}
					else {
						continue;
					}
					
					if(window.ByteSize) {
						code[id].bytes = ByteSize.count(code[id].code);
						code[id].byteSize = ByteSize.format(code[id].bytes);
					}
					
					// Add checkboxes
					var checkbox = code[id].checkbox = document.createElement('input').prop({
							type: 'checkbox',
							value: id
						}),
						label = document.createElement('label');
					
					if(i === 0) {
						checkbox.checked = checkbox.disabled = true;
						label.textContent = 'Chainvas Core';
					}
					else {
						label.textContent = id + ' module';
						checkbox.onclick = updateSize;
					}
					
					label.innerHTML += ' (' + code[id].byteSize + ')';
					
					label.insertBefore(checkbox, label.firstChild);
					
					p.appendChild(label);
				}
				
				updateSize();
			}
			else {
				// TODO show error
				console.log(xhr.status, xhr.statusText);
			}
		}
	};
	
	xhr.send(null);
	
	form.onsubmit = function() {
		evt.preventDefault();
		
		a.onclick();
		a.click();
		
		return false;
	};
	
	a.onclick = function(evt) {
		var codeParts = [];
		
		for(var id in code) {
			if(code[id].checkbox.checked) {
				codeParts.push(code[id].code);
			}
		}
		var blob = new Blob(
			[codeParts.join('\r\n')],
			{type : 'text/javascript'}
		);
		this.href = URL.createObjectURL(blob);
		this.download = 'chainvas.js';
	};
};

function updateSize() {
	var totalSize = 0;
	
	for (var id in code) {
		if(code[id].checkbox.checked) {
			totalSize += code[id].bytes;
		}
	}
	
	document.getElementById('filesize').innerHTML = ByteSize.format(totalSize);
}

})();

/**
 * Table of contents
 */
(function(){

var toc = document.querySelector('#toc ol'),
	headings = document.querySelectorAll('body > h2');

for(var i=0; i<headings.length; i++) {
	var li = document.createElement('li');

	li.appendChild(document.createElement('a').prop({
		textContent: headings[i].textContent,
		href: '#' + headings[i].id
	}));
	
	toc.appendChild(li);
}

})();