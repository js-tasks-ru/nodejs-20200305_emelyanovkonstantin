const fs = require('fs');
const limitSizeStream = require('./LimitSizeStream');


module.exports = function writeFile(filepath, req, res){

  try{
    if(fs.existsSync(filepath)){
      res.statusCode = 409;
      res.end('File exist');
    }else{
      const fileStream = fs.createWriteStream(filepath);
      fileStream.
        on('finish', function() {          
          res.statusCode = 201;
          res.end('done');
        });
      res.on('close',()=>{
        if(res.finished) return;
        fileStream.destroy();
        if (fs.existsSync(filepath)){
          fs.unlink(filepath, (err) => {
            if (err) throw err;        
          });
        }
      });
      const sizeStream = new limitSizeStream({limit : 1024*1024});
      sizeStream.
       on('error',(err)=>{        
        if (err.name == "LimitExceededError"){
          res.statusCode = 413;
          res.end("Error. Large File.");          
          if(fs.existsSync(filepath)){
            fs.unlink(filepath, (err) => {
              if (err) throw err;        
            });
          }
        }
       });
      req.pipe(sizeStream);
      sizeStream.pipe(fileStream);  
    }
  }catch(err){
    res.statusCode = 500;
    res.end('Error');
    console.error(err);
  }  
}