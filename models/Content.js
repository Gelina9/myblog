/*
* 创建内容模型类
* */
let mongoose = require('mongoose')
let ContentsSchemas = require('../schemas/contents')

let Contents =  mongoose.model('Content',ContentsSchemas);
module.exports = Contents