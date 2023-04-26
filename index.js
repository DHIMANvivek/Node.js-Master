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
    res.end('Hello Learner - by Vivek Dhiman\n');

    console.log(' payload : ',buffer);
});
});

// send the response
// res.end('Hello Learner - by Vivek Dhiman\n');

// log the request path 
// console.log('Request received on path '+trimmedPath + ' with this method : '+method + ' with these query string parameters : ',queryStringObject, ' Request Received with these headers ',headers);
// });

// start the server ,and have it listen on port 3000
server.listen(3000 , function(){
    console.log('server is start listening on port 3000 now');
});

// suppose we are defining a request router

