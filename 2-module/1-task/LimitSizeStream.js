const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.tmp = 0;
  }

  _transform(chunk, encoding, callback) {    
    this.tmp += chunk.byteLength;
    if (this.tmp <= this.limit){
      callback(null,chunk.toString());
    }else{
      callback(new LimitExceededError);
    }   
  }
}

module.exports = LimitSizeStream;
