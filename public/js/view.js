//分页
let perPage = 10;
let page = 1;
let pages = 0;
let comments=[];
//提交评论
$("#submitComment").click(function() {
  $.ajax({
    type: "POST",
    url: "/api/comment/post",
    data: {
      contentid: $("#contentId").val(),
      content: $("#content_detail").val()
    },
    success: function(res) {
      $("#content_detail").val("");
      comments = res.data.comments.reverse();
      renderComment();
    }
  });
});
//每次页面重载的时候获取该文章所有评论
$.ajax({
  url: "/api/comment",
  data: {
    contentid: $("#contentId").val()
  },
  dataType: "json",
  success: function(res) {
    comments = res.data.reverse();
    renderComment();
  }
});
$(".comment_page").delegate('a','click',function(){
    if($(this).parent().hasClass('prev_page')){ //上一页
      page--;
    }else{  //下一页
      page++;
    }
    renderComment();
})
//渲染评论
function renderComment() {
  $(".comment-total span").html(comments.length);
  let start = Math.max(0,(page-1)*perPage);
  let end = Math.min(start+perPage,comments.length);
  pages = Math.max(Math.ceil(comments.length / perPage),1);
  let $lis = $(".comment_page li");
  $lis.eq(1).html(page + " / " + pages);
  if(page<=1){
    page=1;
    $lis.eq(0).html('<span>没有上一页了</span>')
  }else{
    $lis.eq(0).html('<a>上一页</a>')
  }
  if(page>=pages){
    page=pages;
    $lis.eq(2).html('<span>没有下一页了</span>')
  }else{
    $lis.eq(2).html('<a>下一页</a>');
  }
  if(comments.length==0){
    $(".no_msg").show();
    $(".comment-list").hide();
  }else{
    let commentInfo = "";
    for (var i = start; i < end; i++) {
      commentInfo += `<li>
        <div class="clearfix">
        <a  href="#" class="pull-left">${comments[i].username}</a>
        <span class="pull-right">${comments[i].postTime}</span>
        </div>
        <p>${comments[i].content}</p>
      </li>`;
    }
    $(".comment-list").html(commentInfo);
  }
}
