const Categories = require("../models/Category");
module.exports.categoryList = async function categoryList(ctx, next) {
  let find = await Categories.find({}, '_id subcategories title');
  let cat = find.map(function(obj) {
    var sub =  obj.subcategories.map(function(subObj) {
      return {
        id : subObj.id,        
        title : subObj.title
      }
    })
    return {
      id : obj.id,
      subcategories : sub,
      title : obj.title
    }
  });   
  ctx.body = {categories: cat};
};
