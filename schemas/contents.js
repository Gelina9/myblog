let mongoose = require('mongoose')

let contentSchemas = new mongoose.Schema({
    //分类名：关联字段-内容分类表的id
    category:{
        type:mongoose.Schema.Types.ObjectId, //类型
        ref:'Category' //引用
    },
    //标题
    title:String,
    //用户id：关联字段-用户表的id
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    //简介
    description:{
        type:String,
        default:''
    },
    //内容
    content:{
        type:String,
        default:''
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }
});
module.exports=contentSchemas