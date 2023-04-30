// dependencies
var http = require("http")
var https = require("https")
var url = require("url")
var StringDecoder = require("string_decoder").StringDecoder
var config = require("./config")
var fs = require("fs")
var _data = require("./lib/data")

// TESTING
// @TODO delete this
_data.create("test", "newFile", { foo: "bar" }, function (err) {
  console.log("this was the error ", err)
})

// _data.read("test", "newFile", function (err,data) {
//     console.log("this was the error ", err,data)
//   })

// _data.update("test", "newFile", { 'fizz': "buzz" }, function (err) {
//   console.log("this was the error ", err)
// })

// _data.delete("test", "newFile", function (err) {
//   console.log("this was the error ", err)
// })

// Instantiate the http Server
var httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res)
})

// start the http server
httpServer.listen(config.httpPort, function () {
  console.log("server is start listening on port " + config.httpPort)
})

// Instatiate the https server
var httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
}
var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res)
})

// start the https server
httpsServer.listen(config.httpsPort, function () {
  console.log("server is start listening on port " + config.httpsPort)
})

// Define the handlers
var handlers = {}

// ping handler
handlers.ping = function (data, callback) {
  callback(200)
}

// not Found handler
handlers.notFound = function (data, callback) {
  callback(404)
}

// suppose we are defining a request router
var router = {
  ping: handlers.ping,
}

// all the server logic for both the http and https server
var unifiedServer = function (req, res) {
  // get the url and parse it
  var parsedURL = url.parse(req.url, true)

  // get the path from the URL
  var path = parsedURL.pathname
  var trimmedPath = path.replace(/^\/+|\/+$/g, "")

  // Get the queryString as an object
  var queryStringObject = parsedURL.query

  // Get the HTTP Methods
  var method = req.method.toLowerCase()

  // Get the Headers as an object
  var headers = req.headers

  // Get the Payload, if any
  var decode = new StringDecoder("utf-8")
  var buffer = ""
  req.on("data", function (data) {
    buffer += decode.write(data)
  })
  req.on("end", function () {
    buffer += decode.end()
    // choose the handler this request should go to, if the one is not found use the nonFound Handler
    var chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound

    // construct the data object to send to the handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    }

    // Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      // defult status code 200 . or but else acc. to handler
      statusCode = typeof statusCode == "number" ? statusCode : 200

      // payload
      payload = typeof payload == "object" ? payload : {}

      // convert the payload to String
      var payloadString = JSON.stringify(payload)

      // Return the Response
      res.setHeader("Content-Type", "application/json")
      res.writeHead(statusCode) // for status code
      res.end(payloadString)
      console.log(" returning this response : ", statusCode, payloadString)
    })
  })
}
