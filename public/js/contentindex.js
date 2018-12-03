$(".delete_btn").click(function(){
    var _id=$(this).attr('val');
    $.post({
        url:'/admin/content/delete',
        data:{
            id:_id
        },
        success:function(res){
            $(".dialog_bg").fadeIn(200);
            let resInfo=res.message;
            if(res.code=='0'){
                $(".dialog_info").find("img").attr("src","../../public/imgs/success.png");
                setTimeout(function(){
                    window.location.reload();
                },1500)
            }
            $(".dialog_info").find("p").html(resInfo);
            setTimeout(function(){
                $(".dialog_bg").fadeOut(200);
            },2500)
        },
        error:function(e){
            console.log('啊呜~页面崩溃了！');
        }
    })
})
            