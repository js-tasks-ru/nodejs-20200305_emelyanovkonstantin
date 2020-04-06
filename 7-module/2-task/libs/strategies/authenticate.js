const User = require('../../models/User');
module.exports = async function authenticate(strategy, email, displayName, done) {
  if(!email) return done(null, false, 'Не указан email');
  //throw new Error('Не указан email');
  let user = await User.findOne({email: email}, async function(err,user){
    if(!user){      
      await User.create({email: email, displayName: displayName },function (err, user){
        if(err) return done(err);
        return done(null, user);
      })
    }
  }); 
  return done(null, user);
};
