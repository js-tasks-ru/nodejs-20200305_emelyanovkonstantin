const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.tmp = '';   
  }

  _transform(chunk, encoding, callback) {
    this.tmp += chunk.toString();    
    let pos = this.tmp.toString().indexOf(os.EOL);    
    if(!pos){
      this.tmp += chunk.toString();      
    }else{      
      callback(null,this.tmp.substring(0,pos)); 
      this.tmp = this.tmp.substring(pos+1, this.tmp.length);
    }
  }

  _flush(callback) {
    callback(null, this.tmp);
  }
}

module.exports = LineSplitStream;
