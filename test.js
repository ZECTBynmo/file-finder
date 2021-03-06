var FileFinder = require("./file-finder");


// Print all files containing "file-finder" within the current directory and sub-directories
FileFinder.findFiles( __dirname, "file-finder", function(err, files) {
	for( var iFile=0; iFile<files.length; ++iFile ) {
		console.log( "Subdirectory Search: " + files[iFile] );
	}
});

// Print all files containing "file-finder" within the current directory only
FileFinder.findFiles( __dirname, "file-finder", {searchSubDirectories : false}, function(err, files) {
    for( var iFile=0; iFile<files.length; ++iFile ) {
        console.log( "Base Directory Search: " + files[iFile] );
    }
});