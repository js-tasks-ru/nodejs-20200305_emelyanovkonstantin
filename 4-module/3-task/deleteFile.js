const fs  = require('fs');

module.exports = function test(filepath, response){

  try{
    fs.unlinkSync(filepath);
    response.statusCode = "200";
    response.end("File deleted!");
  }catch(e){
    if (e.code ="ENOENT"){
      response.statusCode = "404";
      response.end("No such file");
    }
  } 
}
