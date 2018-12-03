let express = require("express");
let router = express.Router();
let User = require("../models/User");
let Category = require("../models/Category");
let Content = require("../models/Content");

router.use((req, res, next) => {
  if (!req.userInfo.isAdmin) {
    res.send("对不起，只有管理员才可以进入！");
    return;
  }
  next();
});
//后台管理主页
router.get("/", (req, res, next) => {
  res.render("admin/index", {
    userInfo: req.userInfo
  });
  return;
});
// 用户管理
router.get("/user", (req, res, next) => {
  /* 从数据库读取所有用户数据
    limit(num):限制获取数目
    skip():忽略数据数目*/
  var pages = 0;
  var page = Number(req.query.page || 1);
  var limit = 10;
  var skip = (page - 1) * limit;
  User.countDocuments().then(count => {
    //计算总页数
    pages = Math.ceil(count / limit);
    //page不能超过pages，小于1
    page = Math.min(page, pages);
    page = Math.max(page, 1);
    User.find().limit(limit) .skip(skip).then(users => {
        res.render("admin/user_index", {
          userInfo: req.userInfo,
          users: users,
          page: page,
          count: count,
          pages: pages,
          limit: limit,
          link:'user'
        });
        return;
      });
  });
});
//分类首页
router.get("/category", (req, res, nex) => {
  var page = Number(req.query.page || 1);
  var limit = 10;
  var skip = (page - 1) * limit;
  Category.countDocuments().then(count => {
    pages = Math.ceil(count / limit);
    page = Math.min(page, pages);
    page = Math.max(page, 1);
    Category.find().sort({_id:-1}).limit(limit).skip(skip).then(categories => {
        res.render('admin/category_index', {
          userInfo: req.userInfo,
          categories: categories,
          page: page,
          count: count,
          pages: pages,
          limit: limit,
          link:'category'
        });
        return;
      });
  });
});
//添加分类
router.get("/category/add", (req, res, nex) => {
    res.render('admin/category_add');
    return;
});
//分类保存
router.post("/category/add", (req, res, nex) => {
    let name = req.body.name || '';
    if(name==''){
        let responseData={
            code:1,
            message:'分类名称不能为空！'
        }
        res.json(responseData);
        return;
        // res.render('admin/error',{
        //     userInfo:req.userInfo,
        //     message:'名称不能为空'
        // })
        // return;

    }
    //数据库中是否已经存在同名分类名称
    Category.findOne({
        name:name
    }).then((rs)=>{
        if(rs){
            //存在
            let responseData={
                code:2,
                message:'分类名称已经存在！'
            }
            res.json(responseData);
            // res.render('admin/error',{
            //     userInfo:req.userInfo,
            //     message:'分类已经存在'
            // })
            return Promise.reject();
        }else{
            //不存在，保存
            return new Category({
                name:name
            }).save();
        }
    }).then((newCategory)=>{
        let responseData={
            code:0,
            message:'保存成功！'
        }
        res.json(responseData);
        // res.render('admin/success',{
        //     userInfo:req.userInfo,
        //     message:'分类保存成功',
        //     url:'/admin/category'
        // })
    }).catch(new Function());
});
//分类修改
router.get("/category/edit",(req,res,next)=>{
    var id=req.query.id || '';
    Category.findOne({
        _id:id
    }).then((category)=>{
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
        }else{
            res.render('admin/category_edit',{
                userInfo:req.userInfo,
                category:category
            });
        }
    }).catch(new Function())
})
//分类修改保存
router.post("/category/edit",(req,res,next)=>{
    var id=req.query.id || '';
    var name=req.body.name || '';
    Category.findOne({
        _id:id
    }).then((category)=>{
        if(!category){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'分类信息不存在'
            });
            return Promise.reject();
        }else{
            //当用户信息没有做任何修改提交的时候
            if(name==category.name){
                res.render('admin/success',{
                    userInfo:req.userInfo,
                    message:'修改成功',
                    url:'/admin/category'
                });
                return Promise.reject();
            }else{
                //要修改的信息已经存在数据库中
                return Category.findOne({
                    _id:{$ne:id},//id不是当前的id
                    name:name
                })
            }

        }
    }).then((sameCategory)=>{
        if(sameCategory){
            res.render('admin/error',{
                userInfo:req.userInfo,
                message:'数据库已经存在同名分类'
            });
            return Promise.reject();
        }else{
            return Category.updateOne(
                {_id:id},
                {name:name}
            );
        }
    }).then(()=>{
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'修改成功',
            url:'/admin/category'
        });
    }).catch(new Function())
})
//分类删除
router.post('/category/delete',(req,res,next)=>{
    var id=req.body.id || '';
    Category.deleteOne({
        _id:id
    }).then(()=>{
        let responseData={
            code:0,
            message:'删除成功！'
        }
        res.json(responseData);
        // res.render('admin/success',{
        //     userInfo:req.userInfo,
        //     message:'删除成功',
        //     url:'/admin/category'
        // });
    }).catch(new Function())
})
//内容首页
router.get('/content',(req,res,next)=>{
    var page = Number(req.query.page || 1);
    var limit = 10;
    var skip = (page - 1) * limit;
    Content.countDocuments().then(count => {
    pages = Math.ceil(count / limit);
    page = Math.min(page, pages);
    page = Math.max(page, 1);
    Content.find().sort({addTime:-1}).limit(limit).skip(skip).populate(['category','user']).then(contents => {
        res.render('admin/content_index', {
          userInfo: req.userInfo,
          contents: contents,
          page: page,
          count: count,
          pages: pages,
          limit: limit,
          link:'content'
        });
        return;
      });
  });
})
//添加内容
router.get('/content/add',(req,res,next)=>{
    Category.find().sort({_id:-1}).then((categories)=>{
        res.render('admin/content_add',{
            userInfo:req.userInfo,
            categories:categories
        });
    })
})
//内容保存
router.post('/content/add',(req,res,next)=>{
    let category=req.body.category;
    let title=req.body.title;
    let description=req.body.description;
    let content=req.body.content;
    let userInfo=req.userInfo;
    if(!category||title==''||description==''||content==''){
        let responseData={
            code:1,
            message:'需填信息不能为空！'
        }
        res.json(responseData);
        // res.render('admin/error',{
        //     userInfo:userInfo,
        //     message:'需填信息不能为空！'
        // })
        return;
    }
    //保存
    return new Content({
        category:category,
        title:title,
        user:userInfo._id.toString(),
        description:description,
        content:content
    }).save().then(()=>{
        let responseData={
            code:0,
            message:'博文保存成功！'
        }
        res.json(responseData);
        // res.render('admin/success',{
        //     userInfo:req.userInfo,
        //     message:'内容保存成功！',
        //     url:'/admin/content'
        // })
    }).catch(function(){return;})
})
//内容修改
router.get('/content/edit',(req,res,next)=>{
    let id=req.query.id;
    let categories=[];
    Category.find().sort({_id:1}).then((rs)=>{
        categories = rs;
        return Content.findOne({
            _id:id
        }).populate('category');
    }).then((content)=>{
            if(!content){
                res.render('admin.error',{
                    userInfo:req.userInfo,
                    message:'指定内容不存在'
                });
                return Promise.reject();
            }else{
                res.render('admin/content_edit',{
                    userInfo:req.userInfo,
                    categories:categories,
                    content:content
            })
        }
    })
})
//内容修改保存
router.post('/content/edit',(req,res,next)=>{
    var id=req.query.id || '';
    let category=req.body.category;
    let title=req.body.title;
    let description=req.body.description;
    let content=req.body.content;
    if(title==''||description==''||content==''){
        res.render('admin/error',{
            userInfo:req.userInfo,
            message:'需填信息不能为空！'
        })
        return;
    }
    Content.updateOne(
        {_id:id},
        {
            category:category,
            title:title,
            description:description,
            content:content
        }
    ).then(()=>{
        res.render('admin/success',{
            userInfo:req.userInfo,
            message:'内容保存成功！',
            url:'/admin/content'
        })
    })
})
//内容删除
router.post('/content/delete',(req,res,next)=>{
    var id=req.body.id || '';
    Content.deleteOne({
        _id:id
    }).then(()=>{
        let responseData={
            code:0,
            message:'删除成功！'
        }
        res.json(responseData);
        // res.render('admin/success',{
        //     userInfo:req.userInfo,
        //     message:'删除成功',
        //     url:'/admin/content'
        // });
    }).catch(new Function())
})
module.exports = router;
