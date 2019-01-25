
(function(){
/**
 * 定义这个文件的构造函数
 */

var Users = function () {
    // 定义页面需要的数据
    this.pageNum = 1; // 当前的页面数   
    this.pageSize = 3; //每页显示的条数
    this.totalPage = 0; // 总的页数
    this.usersList = []; //Users 数据

    // 需要用的的 dom 对象
    this.dom = {
        table: $("#users_table tbody"), //table 的 tbody
        pagination: $(".pagination"), // 分页的 ul
        nameInput: $("#inputEmail3"), //名字输入框
        urlInput: $("#inputPassword3"), //url 输入框
        addModal: $("#addModal"), //新增的模态框 
        submitAdd: $("#addUsersInfo"), //模态框提交按钮
        exampleModal: $("#exampleModal"), //修改提示框
        recipientName: $("#recipient-name"), //名字修改框
        messageText: $("#message-text"), //图片修改框
        upBanner: $("#updateUsers"), //确认修改框
    }
    
}

 // 新增方法
 Users.prototype.add = function () {
    var that = this;
    $.post('/users/add', {
        usersName: this.dom.nameInput.val(),
        password: this.dom.urlInput.val()
    }, function (res) {
        if (res.code === 0) {
            // 成功
            layer.msg('加入成功');
            // 重新请求
            that.search();
        } else {
            layer.msg('网络异常，请稍后重试');
        }
        // 手动关闭模态框
        that.dom.addModal.modal('hide');
        that.dom.nameInput.val('');
        that.dom.urlInput.val('');
    });
}

// 查询的方法
Users.prototype.search = function () {
    var that = this;
    $.get('/users/search', {
        pageNum: this.pageNum,
        pageSize: this.pageSize
    }, function (result) {
        if (result.code === 0) {
            layer.msg('查询成功');
            // 将result.data 写入到 实例的 usersLIst
            that.usersList = result.data;
            // 将result.totalPage 写入到 实例的 usersLIst
            that.totalPage = result.totalPage;
            // 调用渲染 table
            that.renderTable();
            // 调用渲染 分页
            that.renderPage();

        } else {
            layer.msg('网络异常，请稍后重试');
        }
    })
}

/**
 * 渲染table 
 */
Users.prototype.renderTable = function () {
    this.dom.table.html('');
    for (var i = 0; i < this.usersList.length; i++) {
        var item = this.usersList[i];
        this.dom.table.append(
         `
            <tr>
            <td>${item._id}</td>
            <td>${item.userName}</td>
            <td>${item.password}</td>
            <td>${item.nickName}</td>
            </td>
            <td>
            <a class="update" data-id=${item._id} href="javascript:;" data-id="${item._id}" class="update-btn" >修改</a>
            <a class="delete" data-id=${item._id} href="#" class="delete-td" data-id="${item._id}">删除</a>
            </td>
            </tr>
         `
        )
    };

}

 /**
 * 渲染分页
 */
Users.prototype.renderPage = function () {
    var prevClassName = this.pageNum === 1 ? 'disabled' : '';
    var nextClassName = this.pageNum === this.totalPage ? 'disabled' : '';
    this.dom.pagination.html('');
    // 添加上一页
    this.dom.pagination.append(
        `
        <li class="${prevClassName}" data-num=${this.pageNum - 1}>
            <a href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        `
    )
    // 根据 this.totalPage 循环渲染 多少个li
    for (var i = 1; i <= this.totalPage; i++) {
        var pageName = this.pageNum == i ? 'active' : '';
        this.dom.pagination.append(
            `
            <li class = "${pageName}" data-num=${i}><a href="#">${i}</a></li>
            `
        )
    }
    // 添加下一页
    this.dom.pagination.append(
        `
        <li class="${nextClassName}" data-num=${this.pageNum + 1}>
            <a href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li> 
            `
    )
}

// 将所有的DOM 事件 操作放这里
Users.prototype.bidDOM = function(){
    var that = this;
     // 点击确认新增按钮需要调用 add
     this.dom.submitAdd.click(function () {
        that.add();
    });
    // 分页按钮点击事件
    this.dom.pagination.on('click', 'li', function () {
        // 得到页码
        // 如果自定义属性 attr 获取属性  用data开头可以更简单地使用 data 
        var num = parseInt($(this).data('num'));
        // 1.1判断是否点击的是相同页,或者 <1 && >总页数
        if (that.pageNum === num || num < 1 || num > that.totalPage) {
            return;
        }

        // 设置给 this.pageNum
        that.pageNum = num;
        // 在次调用this.search
        that.search();

    });
}
    // 最后
    $(function () {
        var users = new Users();
        users.bidDOM();
        users.search(); //默认渲染第一页
    })
})();



















/* $(function(){
    
var pageNum = 1;
var pageSize = 4;
var currentId = ''; // 当前操作的id


// 监听 修改按钮的点击事件
$('#users_table tbody').on('click', '.update-btn', function () {
    // alert(1);
    var id = $(this).attr('data-id');
    currentId = id;
    $('#exampleModal').modal('show');
});

 // 修改信息
 $("#changeUsers").click(function(){
    $.post('/users/change',{
        id: currentId,
        usersName: $("#recipient-name").val(),
        password: $("#message-text").val()
    },function(res){
        if(res.code === 0) {
            // 成功
            layer.msg('修改成功'); 
        } else {
            console.log('res.msg');
            layer.msg('修改失败，请稍后重试');
        }
        // 手动关闭模态框
        $("#change").modal('hide');
    })
    $("#recipient-name").val('');
    $("#message-text").val('');
    
});


// 监听 删除按钮的点击事件
$("#users_table tbody").on("click",".delete-td",function(){
    $(this).parent().parent().remove();
    var id = $(this).attr('data-id');
    currentId = id;
    $.post('/users/delete',{
        id:currentId
    },function(res){
        if(res.code === 0) {
            // 成功
            layer.msg('删除成功'); 
            console.log(res)
        } else {
            console.log('res.msg');
            layer.msg('删除失败，请稍后重试');
        }
    })
});


// 点击新增新增用户信息

$("#addUsersInfo").click(function(){
    
    $.post('/users/add',{
        usersName:$("#inputEmail3").val(),
        password:$("#inputPassword3").val()
    },function(res){
        if(res.code === 0) {
            // 成功
            layer.msg('加入成功'); 
            console.log(res)
        } else {
            console.log('res.msg');
            layer.msg('网络异常，请稍后重试');
        }
         // 手动关闭模态框
         $("#myModal").modal('hide');
         $("#inputEmail3").val('');
         $("#inputPassword3").val('')
    });
});

// 默认 调用 search
search(pageNum,pageSize);


// 点击页数
$(".pagination").on("click","li",function(){ 
    pageNum = $(this).index();
    search(pageNum,pageSize);       
});

}) */
/**
 * 查询banner数据的方法
 * @param{Number} pageNum 当前页数
 * @param {Number} pageSize 每页显示条数
 */ 

/* function search(pageNum,pageSize){
    $.get('/users/search',{
      pageNum:pageNum,
      pageSize:pageSize
    },function(result){
      if(result.code === 0){
         layer.msg('查询成功');
         $("#users_table tbody").html('');
         for(var i =0 ;i< result.data.length; i++){
             var item = result.data[i];
             $("#users_table tbody").append(
                `
                 <tr>
                  <td>${item._id}</td>
                  <td>${item.name}</td>
                  <td>${item.password}</td>
                  </td>
                  <td>
                      <a href="javascript:;" data-id="${item._id}" class="update-btn" >修改</a>
                      <a href="#" class="delete-td" data-id="${item._id}">删除</a>
                  </td>
                 </tr>
                `
             )
         }
      } else {
          console.log(result.msg)
          layer.msg('网络异常，请稍后重试');
      }
    })
  }
 */