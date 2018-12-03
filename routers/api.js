let express= require('express');
let router=express.Router();
let User=require('../models/User');
let Content=require('../models/Content')
//统一返回格式
let responseData;
router.use(function(req,res,next){
    responseData={
        code:0,
        message:''
    }
    next();
})
//处理用户注册
router.post('/user/register',function(req,res,next){
    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;
    if(username==''){
        responseData.code=1;
        responseData.message='用户名不能为空！';
        res.json(responseData);
        return;
    }
    if(password==''){
        responseData.code=2;
        responseData.message='密码不能为空';
        res.json(responseData);
        return;
    }
    if(password!=repassword){
        responseData.code=3;
        responseData.message='两次密码输入不一致！';
        res.json(responseData);
        return;
    }
    //查询数据
    User.findOne({
        username:username
    }).then((userInfo)=>{
        if(userInfo){
            //表示数据库有这条记录
            responseData.code=4;
            responseData.message='该用户名已经被注册！';
            res.json(responseData);
            return;
        }
        //保存用户注册信息
        let user=new User({
            username:username,
            password:password
        });
        return user.save();
    }).then((newUserInfo)=>{
        console.log(newUserInfo);
        responseData.message='注册成功！'
        res.json(responseData);
    }).catch(new Function())
})

//处理用户登录
router.post('/user/login',function(req,res){
    let username = req.body.username;
    let password = req.body.password;
    if(username==''||password=='') {
        responseData.code=1;
        responseData.message='用户名或密码不能为空！';
        res.json(responseData);
        return;
    }
    User.findOne({
        username:username,
        password:password
    }).then((userInfo)=>{
        if(!userInfo){
            responseData.code=2;
            responseData.message='用户名或密码错误！';
            res.json(responseData);
            return;
        }
        //用户名和密码正确
        responseData.message='登录成功！';
        responseData.userInfo={
            _id:userInfo._id,
            username:userInfo.username
        };
        req.cookies.set('userInfo',JSON.stringify({
            _id:userInfo._id,
            username:userInfo.username
        }));
        res.json(responseData);
        return;
    }).catch(new Function())
})
//处理用户退出登录
router.get('/user/logout',function(req,res,next){
    req.cookies.set('userInfo',null);
    res.json(responseData);
})
//获取评论
router.get('/comment',function(req,res,next){
    let contentid=req.query.contentid||'';
    Content.findOne({
        _id:contentid
    }).then(content=>{
        responseData.data=content.comments;
        res.json(responseData);
    }).catch(new Function())
})
//评论提交
router.post('/comment/post',(req,res,next)=>{
    let postDate = formatDate(new Date()).toString();
    let contentid=req.body.contentid||'';
    let postData={
        username:req.userInfo.username,
        postTime:postDate,
        content:req.body.content
    };
    Content.findOne({
        _id:contentid
    }).then(content=>{
        content.comments.push(postData);
        return content.save();
    }).then((newContent)=>{
        responseData.message='评论成功！';
        responseData.data=newContent;
        res.json(responseData);
    }).catch(new Function())
})

function formatDate(time){
    let date = new Date(time);

    let year = date.getFullYear(),
        month = date.getMonth()+1,//月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    let newTime = year + '-' +
                (month < 10? '0' + month : month) + '-' +
                (day < 10? '0' + day : day) + ' ' +
                (hour < 10? '0' + hour : hour) + ':' +
                (min < 10? '0' + min : min) + ':' +
                (sec < 10? '0' + sec : sec);

    return newTime;         
}
module.exports=router;