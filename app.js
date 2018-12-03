/*
* 应用程序的启动入口
* by Gianna 2018/09/02
* */

//加载express模块
let express=require('express');
//加载模板处理模块
let swig=require('swig');
//加载数据库处理模块
let mongoose = require('mongoose')
//加载请求处理模板
let bodyParser=require('body-parser')
//加载cookies模块
let Cookies=require('cookies')
//获取用户数据库
let User=require('./models/User')

//创建app应用
let app=express();

/*
* 设置静态文件托管
* 当用户访问的url以public开始，直接返回对应__dirname+'/public'下的文件
* */
app.use('/public',express.static(__dirname+'/public'));
//配置应用模板
/*
* 定义当前应用的模板引擎
* @param 'html' 模板引擎的名称，即后缀
* @param swig.renderFile  解析方法
* */
app.engine('html',swig.renderFile);
/*
* 设置目录
* @param views 固定
* @param '/views' 目录
* */
app.set('views','./views')
/*
* 注册
* 参数1固定，参数2是模板名称后缀
* */
app.set('view engine','html');
//取消模板缓存，便于开发
swig.setDefaults({cache:false});

app.use((req,res,next)=>{
    req.cookies=new Cookies(req,res);
    //解析登录用户的cookie信息
    req.userInfo={}
    if(req.cookies.get('userInfo')){
        try {
            req.userInfo=JSON.parse(req.cookies.get('userInfo'));
            User.findById(req.userInfo._id).then((userInfo)=>{
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
                next();
            })
        }catch(e){
            next();
        }
    }else{
        next();
    }
})
//保存的是post请求的数据
app.use(bodyParser.urlencoded({extended:true}))
//根据不同名称划分模快
app.use('/admin',require('./routers/admin'))
app.use('/api',require('./routers/api'))
app.use('/',require('./routers/main'))

//连接数据库
mongoose.connect('mongodb://localhost:27018/MyBlog',{ useNewUrlParser: true },function(err){
    if(err){
        console.log("数据库连接失败");
    }else{
        console.log("数据库连接成功");
        //监听http请求
        app.listen(8080);
    }
});