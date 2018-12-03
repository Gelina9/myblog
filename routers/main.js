let express= require('express');
let router=express.Router();
let Category = require("../models/Category");
let Content = require("../models/Content");

let data={}
//通用数据
router.use((req,res,next)=>{
    data={
        userInfo:req.userInfo,
        categories:[],
    }
    Category.find().then((categories)=>{
        data.categories=categories;
        next();
    })
})
//首页
router.get('/',function(req,res,next){
    //分页
    data.category=req.query.category||'';
    data.count=0;
    data.page=Number(req.query.page||0);
    data.limit=10;
    data.pages=0;
    let where={};
    if(data.category){
        where.category=data.category;
    }
    Content.where(where).countDocuments()
    .then((count)=>{
        data.count=count;
        data.pages=Math.ceil(data.count/data.limit);
        data.page=Math.min(data.page,data.pages);
        data.page=Math.max(data.page,1);
        let skip=(data.page-1)*data.limit;

        return Content.where(where).find().sort({addTime:-1}).limit(data.limit).skip(skip).populate(['category','user']);
    }).then((contents)=>{
        data.contents=contents;
        res.render('main/index',data);
    }).catch(new Function());
})
//阅读全文
router.get('/view',(req,res,next)=>{
    let contentId=req.query.contentid||'';
    Content.findOne({
        _id:contentId
    }).then((content)=>{
        data.content=content;
        content.views++;
        content.save();
        res.render('main/view',data)
    }).catch(new Function())
})
module.exports=router;