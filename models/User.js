/*
* 创建用户模型类
* */
let mongoose = require('mongoose')
let usersSchemas = require('../schemas/users')

let User =  mongoose.model('User',usersSchemas);
module.exports = User