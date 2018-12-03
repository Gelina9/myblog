let mongoose = require('mongoose')

let categorySchemas = new mongoose.Schema({
    //分类名称名
    name:String,
});
module.exports=categorySchemas