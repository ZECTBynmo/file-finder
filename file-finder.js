//////////////////////////////////////////////////////////////////////////
// file-finder - Main module
//////////////////////////////////////////////////////////////////////////
//
// 
/* ----------------------------------------------------------------------
                                                    Object Structures
-------------------------------------------------------------------------

*/
var FileFinder = {};

//////////////////////////////////////////////////////////////////////////
// Node.js Exports
if( exports != undefined )
	FileFinder = exports;


//////////////////////////////////////////////////////////////////////////
// Namespace (lol)
var DEBUG = false;
var log = function( text ) {
	if( DEBUG ) console.log( text ) ;
}

var fs = require('fs');


//////////////////////////////////////////////////////////////////////////
// Recursively searches a directory for files with a given string in them
FileFinder.findFiles = function( directory, searchString, options, callback ) {
    if (arguments.length == 3) { // if only three arguments were supplied
        if (Object.prototype.toString.call(options) == "[object Function]") {
            callback = options;
            options = {};
        }
    }

	log( "Searching directory " + directory + " recursively" );

	if( searchString === undefined || searchString == "" ) {
		log( "Error@FileFinder.findFiles: Search string required")
		return callback( null, {} );
	}

	var matches = [],
        searchSubDirectories = options.searchSubDirectories === undefined && true; //default to search subdirectories

	// Read into the directory
  	fs.readdir(directory, function(err, files) {
	    if( err ) {
	    	return callback( err );
	    }

	    var numFilesRemaining = files.length;

	    if( numFilesRemaining === 0 ) 
	    	return callback( null, matches );

	    // Examine each file
	    files.forEach(function(file) {
	    	file = directory + '/' + file;
	    	fs.stat( file, function( err, stat ) {
		        if( stat && stat.isDirectory() && searchSubDirectories) {
		          	FileFinder.findFiles( file, searchString, options, function( err, res ) {
		            	matches = matches.concat(res);

		            	numFilesRemaining -= 1;

		            	if ( numFilesRemaining === 0 ) 
		            		callback( null, matches );
		          	});
		        } else {
		        	// Push this file into our results if it contiains the substring
		          	if( file.indexOf(searchString) != -1 )
	      				matches.push( file );

		          	numFilesRemaining -= 1;

	            	if ( numFilesRemaining === 0 ) 
	            		callback( null, matches );
		        }
	      	});
	    });
  	});
}; // end FileFinder.findFiles()