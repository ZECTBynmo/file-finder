FileFinder
==================

This module searches a directory recursively for a file 
that matches some string key.

Installation
==================
```
npm install file-finder
```

Usage
==================
```
var FileFinder = require( 'file-finder' );

var options = {
    searchSubDirectories : true
}

FileFinder.findFiles( directory, searchString, options, function(error, matchingFiles) {
	...do some stuff with the files that matched the search string
});
```

