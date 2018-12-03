$(function(){
    let $loginBox = $(".login_box");
    let $signBox=$(".sign_box");
    let $userInfo=$(".user_info");
    let $loginNav=$("#nav_login .nav_login");
    //打开登录弹框
    $loginNav.click(()=>{
        $("#dialog").fadeIn(250);
    })
    //关闭登录弹框
    $("#dialog .closeDia").click(()=>{
        $("#dialog").fadeOut(250);
    })
    //切换登录
    $signBox.find("a").on('click',function(){
        $signBox.hide();
        $loginBox.show();
    })
    //切换注册
    $loginBox.find("a").on('click',function(){
        $loginBox.hide();
        $signBox.show();
    })
    //点击注册
    $signBox.find("button").on('click',function(){
        let username=$signBox.find("input[name='username']").val();
        let password=$signBox.find("input[name='password']").val();
        let repassword=$signBox.find("input[name='repassword']").val();
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:username,
                password:password,
                repassword:repassword
            },
            dataType:'json',
            success:function(data){
                $signBox.find('.error').html(data.message);
                if(!data.code){
                    setTimeout(()=>{
                        $signBox.hide();
                        $loginBox.show();
                    },1000)
                }
            }
        })
    })

    //点击登录
    $loginBox.find("button").on('click',function(){
        let username=$loginBox.find("input[name='username']").val();
        let password=$loginBox.find("input[name='password']").val();
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:username,
                password:password
            },
            dataType:'json',
            success:function(data){
                $loginBox.find('.error').html(data.message);
                if(!data.code){
                    setTimeout(()=>{
                        window.location.reload();
                    },1000)
                }

            }
        })
    })
    //博文分类展开收起
    $("#nav_blog").on({
        mouseenter:function(){
            $("#nav_blog>ul").slideDown(100);
        },
        mouseleave:function(){
            $("#nav_blog>ul").slideUp(100);
        }
    })
    //管理面板展开收起
    $userInfo.on({
        mouseenter:function(){
            $userInfo.find(".drop").slideDown(100);
        },
        mouseleave:function(){
            $userInfo.find(".drop").slideUp(100);
        }
    })
    //退出登录
    $userInfo.find(".logout").on('click',function(){
        $.ajax({
            url:'/api/user/logout',
            success:function(data){
                if(!data.code){
                    window.location.reload();
                }
            }
        })
    })
})