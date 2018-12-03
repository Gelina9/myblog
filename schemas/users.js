let mongoose = require('mongoose')

let userSchemas = new mongoose.Schema({
    //用户名
    username:String,
    //密码
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});
module.exports=userSchemas