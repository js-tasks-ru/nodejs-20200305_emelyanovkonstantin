const Order = require('../models/Order');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {

  if(!ctx.user){
    ctx.status = 401;
    ctx.body = { errors:'Пользователь не авторизован' };
    return next();
  }else{
    try{
      let order = await Order.create({
        user: ctx.user,
        product: ctx.request.body.product,
        phone: ctx.request.body.phone,
        address: ctx.request.body.address
      });
      let options={};
      options.to = ctx.user.email;
      options.subject = "order-confirmation";
      options.template = 'order-confirmation',
      options.locals ={
        id: order._id,
        product: ctx.request.body.product
      }
      await sendMail(options);
      ctx.status = 200;
      ctx.body = { order: order._id }
      next();
  
    }catch(err){    
      if(err.name == 'ValidationError'){
        ctx.status = 400;     
        let sendError = {
          product: err.errors.product.message,
          phone: err.errors.phone.message,
          address: err.errors.address.message
        }      
        ctx.body = {errors:sendError };
        next();
      }else{
        ctx.status = 400;
        ctx.body = { errors: err };
        next(); 
      }         
    }
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {

  let orders = await Order.find({user: ctx.user.id});
  ctx.status = 200;
  ctx.body = {orders: orders};      
  return next();
};
