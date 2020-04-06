const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      let result = await User.findOne({email: email},async (err, user)=>{
        if (err) ctx.throw(404);        
        if (!user){                    
          return done(null, false, 'Нет такого пользователя');
        }        
        if(!await user.checkPassword(password)){
          return done(null, false, 'Неверный пароль');
        }else{
          done(null, user, 'Приветствие!');
        }
      });
     // done(null, false, 'Стратегия подключена, но еще не настроена');
    }
);
