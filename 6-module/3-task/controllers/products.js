const Product = require('../models/Product')
module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  if(ctx.query.query){
    //const product = await Product.find({$or: [{title: ctx.query.query},{description: ctx.query.query}]}); 
    const product = await Product.find({$text: {$search: ctx.query.query}}); 
    ctx.body = {products: product}; 
  }else{
    //const product = await Product.find({});  
    ctx.body = {products: []}; 
  }
  next();
  
};
