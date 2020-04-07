const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const verificationToken = uuid();
  let user = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.email,
    verificationToken: verificationToken
  });
  await user.setPassword(ctx.request.body.password);
  try{
    await user.save({validateBeforeSave: true,});
  }catch(err){
    ctx.status = 400;
    ctx.body = { errors: { email: 'Такой email уже существует' } };
    return next();
  }
  let options={};
  options.to = ctx.request.body.email;
  options.subject = "Confirm Email";
  options.template = 'confirmation',
  options.locals ={
    token: verificationToken
  }
  sendMail(options);
  ctx.status = 200;
  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  try{
    let user = await User.findOneAndUpdate({verificationToken: ctx.request.body.verificationToken},{$unset: {verificationToken: ""}});
    if (!user){
      ctx.status = 400;
      ctx.body = { error: 'Ссылка подтверждения недействительна или устарела'  };
      return next();
    }
    let token = ctx.login(user);
    ctx.body = {token : token};
  }catch(err){
    console.log(err);
    ctx.status = 400;
    ctx.body = { errors: { email: 'Такой email уже существует' } };
    return next();
  }
};
