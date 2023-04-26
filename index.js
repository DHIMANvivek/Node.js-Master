//   Routing Code , PathCode , Payload Code

// dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// the server should respond to all requests with a string 
var server = http.createServer( function (req,res){

// get the url and parse it
var parsedURL = url.parse(req.url,true);

// get the path from the URL 
var path = parsedURL.pathname;
var trimmedPath = path.replace(/^\/+|\/+$/g, '');

// Get the queryString as an object
var queryStringObject = parsedURL.query;

// Get the HTTP Methods
var method = req.method.toLowerCase();

// Get the Headers as an object
var headers = req.headers;

// Get the Payload, if any
var decode = new StringDecoder('utf-8');
var buffer = '';
req.on('data',function(data){
    buffer += decode.write(data);
});
req.on('end',function(){
    buffer += decode.end();
    // choose the handler this request should go to, if the one is not found use the nonFound Handler
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct the data object to send to the handler
    var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject, 
        'method' : method,
        'headers' : headers,
        'payload' : buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data , function(statusCode , payload){
        // defult status code 200 . or but else acc. to handler
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        // payload
        payload = typeof(payload) == 'object' ? payload : {};

        // convert the payload to String
        var payloadString = JSON.stringify(payload);

        // Return the Response
        res.writeHead(statusCode);
        res.end(payloadString);
        console.log(' returning this response : ',statusCode,payloadString);
    });
});
});

// start the server ,and have it listen on port 3000
server.listen(3000 , function(){
    console.log('server is start listening on port 3000 now');
});

// Define the handlers
var handlers = {};

// sample handler
handlers.sample = function(data , callback) {
// callback a http status code, and a payload object
  callback(406, { 'name' : 'sample handler'});
};

// not Found handler
handlers.notFound = function(data , callback){
 callback(404);
};


// suppose we are defining a request router
var router = {
    'sample' : handlers.sample
};
