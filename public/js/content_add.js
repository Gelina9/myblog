//选择分类
$(".selecttab li").click(function(){
    $(this).addClass("selected").siblings().removeClass("selected");
})
//点击添加分类
$(".selecttab .add_tab").click(function(e){
    $(this).removeClass("selected");
    var addInput=`<span class="addInfo"><input type="text" placeholder="请输入分类名称" class="add_input">
    <a href="javascript:;" class="confirm_add">确认</a>
    <a href="javascript:;" class="cancel_add">取消</a></span>`;
    $(addInput).insertBefore($(this));
    //$(this).before(addInput);
    $(".add_input").trigger('focus');
    $(this).hide();
    
    //取消添加
    $(".cancel_add").click(function(){
        $(this).parent().hide();
        $(".selecttab .add_tab").show();
    })
    //确认添加
    $(".confirm_add").click(function(){
        $.post({
            url:'/admin/category/add',
            data:{
                'name':$(".add_input").val()
            },
            success:function(res){
                $(".dialog_bg").fadeIn(200);
                let resInfo=res.message;
                if(res.code==0){
                    $(".dialog_info").find("img").attr("src","../../public/imgs/success.png");
                    setTimeout(function(){
                        window.location.reload();
                    },1500)
                }else{
                    $(".dialog_info").find("img").attr("src","../../public/imgs/error.png");
                    $(".add_input").trigger('focus');
                }
                $(".dialog_info").find("p").html(resInfo);
                setTimeout(function(){
                    $(".dialog_bg").fadeOut(200);
                },2000)
            }
        })
    })
})
//点击添加博文
$("#submit").click(function(){
    $.post({
        url:'/admin/content/add',
        data:{
            category:$(".selected").attr('value'),
            title:$("#title").val(),
            description:$("#description").val(),
            content:$("#content").val(),
            userInfo:$("#userInfo").val(),
        },
        success:function(res){
            debugger;
            $(".dialog_bg").fadeIn(200);
            let resInfo=res.message;
            if(res.code=='0'){
                $(".dialog_info").find("img").attr("src","../../public/imgs/success.png");
                setTimeout(function(){
                    window.location.href='/admin/content';
                },1500)
            }else{
                $(".dialog_info").find("img").attr("src","../../public/imgs/error.png");
            }
            $(".dialog_info").find("p").html(resInfo);
            setTimeout(function(){
                $(".dialog_bg").fadeOut(200);
            },2000)
        },
        error:function(e){
            console.log('啊呜~页面崩溃了！');
        }
    })
})