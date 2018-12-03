/*
* 创建分类模型类
* */
let mongoose = require('mongoose')
let CategoriesSchemas = require('../schemas/categories')

let Categories =  mongoose.model('Category',CategoriesSchemas);
module.exports = Categories