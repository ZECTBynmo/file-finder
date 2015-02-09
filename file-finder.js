"use strict";
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
if (exports != undefined)
    FileFinder = exports;


//////////////////////////////////////////////////////////////////////////
// Namespace (lol)
var DEBUG = false;
var log = function (text) {
    if (DEBUG) console.log(text);
}

var fs = require('fs'),
    path = require('path');


//////////////////////////////////////////////////////////////////////////
// Recursively searches a directory for files with a given string in them
FileFinder.findFiles = function (directory, searchString, options, callback) {
    if (arguments.length == 3) { // if only three arguments were supplied
        if (Object.prototype.toString.call(options) == "[object Function]") {
            callback = options;
            options = {};
        }
    }

    log("Searching directory " + directory + " recursively");

    if (searchString === undefined || searchString == "") {
        log("Error@FileFinder.findFiles: Search string required")
        return callback(null, {});
    }

    var matches = [],
        searchSubDirectories = options.searchSubDirectories === undefined && true; //default to search subdirectories

    // Read into the directory
    fs.readdir(directory, function (err, files) {
        if (err) {
            return callback(err);
        }

        var numFilesRemaining = files.length;

        if (numFilesRemaining === 0)
            return callback(null, matches);

        // Examine each file
        files.forEach(function (file) {
            file = directory + '/' + file;
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory() && searchSubDirectories) {
                    FileFinder.findFiles(file, searchString, options, function (err, res) {
                        matches = matches.concat(res);

                        numFilesRemaining -= 1;

                        if (numFilesRemaining === 0)
                            callback(null, matches);
                    });
                } else {
                    // Push this file into our results if it contiains the substring
                    if (file.indexOf(searchString) != -1)
                        matches.push(file);

                    numFilesRemaining -= 1;

                    if (numFilesRemaining === 0)
                        callback(null, matches);
                }
            });
        });
    });
}; // end FileFinder.findFiles()

//////////////////////////////////////////////////////////////////////////
// Recursively searches a directory for files with a given string in them
FileFinder.findFilesStats = function (directory, searchString, options, callback) {
    if (arguments.length == 3) { // if only three arguments were supplied
        if (Object.prototype.toString.call(options) == "[object Function]") {
            callback = options;
            options = {};
        }
    }

    FileFinder.findFiles(directory, searchString, options, function (err, results) {
        if (err) {
            callback(err, null);
        } else {
            populateFileStats(results, callback);
        }
    });
};

function populateFileStats(filesList, callback) {
    var itemCount = filesList.length;
    var fileInfoList = [];
    if (itemCount === 0) {
        return callback(null, filesList);
    }

    filesList.forEach(function (file) {
        fs.stat(file, function (err, stats) {
            if (err) {
                callback(err, null);
            }
            fileInfoList.push({fullName: file,
                dirName: path.dirname(file),
                baseName: path.basename(file),
                ext: path.extname(file),
                dev: stats.dev,
                ino: stats.ino,
                mode: stats.mode,
                nlink: stats.nlink,
                uid: stats.uid,
                gid: stats.gid,
                rdev: stats.rdev,
                size: stats.size,
                blksize: stats.blksize,
                block: stats.blocks,
                atime: stats.atime,
                mtime: stats.mtime,
                ctime: stats.mtime,
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory(),
                isBlockDevice: stats.isBlockDevice(),
                isCharacterDevice: stats.isCharacterDevice(),
                isFIFO: stats.isFIFO(),
                isSocket: stats.isSocket()
            });
            itemCount -= 1;
            if (itemCount === 0) {
                callback(null, fileInfoList);
            }
        });
    });
}
