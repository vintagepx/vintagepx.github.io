var http = require('http');
var fs = require('fs');
var path = require('path');

const server = http.createServer(function(request, response) {
  console.log('request starting...');
  
  var filePath = '.' + request.url;
  if (filePath == './')
      filePath = './index.html';

  var extname = path.extname(filePath);
  var contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;      
    case '.jpg':
      contentType = 'image/jpg';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
  }

  console.log(filePath);
  fs.readFile(filePath, function(error, content) {
    if (error) {
      if(error.code == 'ENOENT'){
        response.writeHead(200, { 'Content-Type': contentType });
        response.end('404', 'utf-8');
      }
      else {
        response.writeHead(500);
        response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
      }
    }
    else {
      response. 'Access-Control-Allow-Origin'
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(content, 'utf-8');
    }
  });
}).listen(3000);
