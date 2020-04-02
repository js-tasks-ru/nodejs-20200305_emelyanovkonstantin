const Product = require("../models/Product");
var ObjectId = require('mongoose').Types.ObjectId; 
module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if(ctx.query.subcategory){
    const product = await Product.find({subcategory: ctx.query.subcategory});  
    ctx.body = product; 
  }else{
    const product = await Product.find({});  
    ctx.body = product;
  }
  next();
};

module.exports.productList = async function productList(ctx, next) {
  let body = ctx.body.map(function(obj) {    
    return {
      id : obj.id,
      title : obj.title,
      images: obj.images,
      category: obj.category,
      subcategory : obj.subcategory,
      price: obj.price,
      description: obj.description,            
    }
  }); 
  ctx.body = {products: body};
  next();
  //ctx.body = {};
};

module.exports.productById = async function productById(ctx, next) {
 if(!ObjectId.isValid(ctx.params.id)) ctx.throw(400);
 const product = await Product.findById(ctx.params.id, (err, result) => {
  // user is a single document which may be null for no results
  if (err) {
    throw err;
    return;
  }
  if (result) {
    // there is user
  } else {
    // there is no user
  }
});
 if(product){
  let body = {
    id : product.id,
    title : product.title,
    images: product.images,
    category: product.category,
    subcategory : product.subcategory,
    price: product.price,
    description: product.description,
   }  
   ctx.body = {product: body};  
   next();
 }else{
   ctx.throw(404);
 }
 
};

