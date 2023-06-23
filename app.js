const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('index.html', function(error, data) {
    if (error) {
      res.writeHead(404);
      res.write('Error: File Not Found');
    }
    else {
      res.write(data);
    }
    res.end();  
});

});

server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong', error);
    }
    else {
        console.log('Server is listening on port ' + port);
    }

});