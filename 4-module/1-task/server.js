const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const sendFile = require('./sendFile');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);  

  if (pathname.includes('/') || pathname.includes('..')) {
    res.statusCode = 400;
    res.end('Nested paths are not allowed');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);
  const countSlash = pathname.split('/').length-1;
  
  if(countSlash>0){
    res.statusCode = 400;
    res.end("Bad Request");
  }  
  try {
    if (fs.existsSync(filepath)) {  
      switch (req.method) {
        case 'GET':{
          const fileStream = fs.createReadStream(filepath);
          fileStream.pipe(res);
        }
    
          break;
    
        default:
          res.statusCode = 501;
          res.end('Not implemented');
      }
    }else{
      res.statusCode = 404;
      res.end('File Not Exist')
    }
  }catch(err) {
    res.statusCode = 500;
    res.end("Error")
  }  
});

module.exports = server;
