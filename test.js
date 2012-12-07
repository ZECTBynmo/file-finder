var FileFinder = require("file-finder");

// Print all files containing "file-finder" within the current directory
FileFinder.findFile( __dirname, "file-finder", function(err, files) {
	for( var iFile=0; iFile<files.length; ++iFile ) {
		console.log( files[iFile] );
	}
});