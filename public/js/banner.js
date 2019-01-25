(function () {
    /**
     * 定义这个文件的构造函数
     * 
     * 
     */
    var Banner = function () {
        // 定义这个页面需要的数据
        this.pageNum = 1; // 当前的页面数
        this.pageSize = 3; //每页显示的条数
        this.totalPage = 0; // 总的页数
        this.bannerList = []; //banner 数据


        // 需要用的的 dom 对象
        this.dom = {
            table: $("#banner_table tbody"), //table 的 tbody
            pagination: $("#pagination"), // 分页的 ul
            nameInput: $("#inputEmail3"), //名字输入框
            urlInput: $("#inputPassword3"), //url 输入框
            addModal: $("#addModal"), //新增的模态框 
            submitAdd: $("#addBanner"), //模态框提交按钮
            exampleModal: $("#exampleModal"), //修改提示框
            recipientName: $("#recipient-name"), //名字修改框
            messageText: $("#message-text"), //图片修改框
            upBanner: $("#upBanner"), //确认修改框
        }

    }
    // 新增方法
    Banner.prototype.add = function () {
    var that = this;
    // ajax 提交 并且带文件
    // 实例化一个 FormData 对象
    var formData = new FormData();

    // 给 formData 对象 加属性 
    formData.append('bannerName',this.dom.nameInput.val());
    formData.append('bannerImg',this.dom.urlInput[0].files[0]);
    $.ajax({
        url:'/banner/add',
        method:'POST',
        // 上传文件需要添加这两个属性
        processData:false,
        contentType:false,
        data:formData,
        success:function(){
            layer.msg('添加成功');
            that.search();
        },
        error:function(error){
            console.log(error)
            layer.msg('网络异常，请稍后重试');
        },
        complete:function(){
            // 不管成功还是失败都会走进来
            // 手动关闭模态框
            that.dom.addModal.modal('hide');
            that.dom.nameInput.val('');
            that.dom.urlInput.val('');
        }
    })

    }

    // 查询的方法
    Banner.prototype.search = function () {
        var that = this;
        $.get('/banner/search', {
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }, function (result) {
            if (result.code === 0) {
                layer.msg('查询成功');
                // 将result.data 写入到 实例的 bannerLIst
                that.bannerList = result.data;
                // 将result.totalPage 写入到 实例的 bannerLIst
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
    Banner.prototype.renderTable = function () {
        this.dom.table.html('');
        for (var i = 0; i < this.bannerList.length; i++) {
            var item = this.bannerList[i];
            this.dom.table.append(
                `
                <tr>
                <td>${item._id}</td>
                <td >${item.name}</td>
                <td>
                    <img class="banner-img" src= "${item.imgUrl}" alt=""></td>
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

    // 删除的方法
    Banner.prototype.delete = function (id) {
        var that = this;
        $.post('/banner/delete', {
            id: id
        }, function (res) {
            if (res.code === 0) {
                // 成功
                layer.msg('删除成功');
            } else {
                console.log('res.msg');
                layer.msg('删除失败，请稍后重试');
            }
        })
        // 重新请求
        that.search();
    }

    // 修改的方法
    Banner.prototype.update = function (id,moveName) {
        this.dom.recipientName.val(moveName)
        var that = this;
        this.dom.upBanner.click(function () {
            $.post('/banner/change', {
                id: id,
                bannerName: that.dom.recipientName.val(),
                bannerUrl: that.dom.messageText.val()
            }, function (res) {
                if (res.code === 0) {
                    // 成功
                    layer.msg('修改成功');
                    // 重新请求
                    that.search();
                } else {
                    layer.msg('修改失败，请稍后重试');
                }
                // 手动关闭模态框
                $("#change").modal('hide');
                
            });
            
        })
    }

    /**
     * 渲染分页
     */
    Banner.prototype.renderPage = function () {
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
    Banner.prototype.bidDOM = function () {
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

        // 删除按钮点击
        this.dom.table.on('click', '.delete', function () {
            // 得到ID
            var id = $(this).data('id');

            // 二次确认框
            layer.confirm('确认删除吗', function () {
                that.delete(id);
            }, function () {

            })
        });

        // 修改按钮的点击
        this.dom.table.on('click', '.update', function () {
            // 得到ID
            var id = $(this).data('id');
            // 打开修改框
            that.dom.exampleModal.modal('show');
            var moveName = $(this).parent().parent().find('td').eq(1).text();
            // 调用 修改事件
            that.update(id,moveName);
        })
    }


    // 最后
    $(function () {
        var banner = new Banner();
        banner.bidDOM();
        banner.search(); //默认渲染第一页
    })

})();

