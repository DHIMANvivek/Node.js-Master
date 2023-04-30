/*
library for storing and editing data 
*/

// Dependencies
var fs = require("fs")
var path = require("path")

// container for the module (to be exported)
var lib = {}

// Base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/")

// write data to a file
lib.create = function (dir, file, data, callback) {
  // open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        //  convert the data to string
        var StringData = JSON.stringify(data)

        // write to file and close it
        fs.write(fileDescriptor, StringData, function () {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callback(false)
              } else {
                callback("error closing file")
              }
            })
          } else {
            callback("error writing to new file")
          }
        })
      } else {
        callback("it could not create a new file , it may already exist")
      }
    }
  )
}

// read data from a file
lib.read = function (dir, file, callback) {
  fs.readFile(
    lib.baseDir + dir + "/" + file + ".json",
    "utf-8",
    function (err, data) {
      callback(err, data)
    }
  )
}

// update data inside a file
lib.update = function (dir, file, data, callback) {
  // open the file for writing
  fs.open(
    lib.baseDir + dir + "/" + file + ".json",
    "r+",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        //  convert the data to string
        var StringData = JSON.stringify(data)

        // Truncate the file
        fs.truncate(fileDescriptor, function (err) {
          if (!err) {
            // write to the file and close it
            fs.writeFile(fileDescriptor, StringData, function (err) {
              if (!err) {
                fs.close(fileDescriptor, function (err) {
                  if (!err) {
                    callback(false)
                  } else {
                    callback("ther is an error closing the writing file")
                  }
                })
              } else {
                callback("error in writing file ")
              }
            })
          } else {
            callback("error truncating file")
          }
        })
      } else {
        callback("could not open the file update , it may not exist")
      }
    }
  )
}

// delete a file
lib.delete = function(dir,file,callback){
    // Unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false)
        }else {
            callback('error in unlink or deleting the file')
        }
    })
}

// export the module
module.exports = lib
