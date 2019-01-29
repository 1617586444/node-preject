(function () {
    var Cinema = function () {
        // 定义页面需要的数据
        this.pageNum = 1; // 当前的页面数   
        this.pageSize = 3; //每页显示的条数
        this.totalPage = 0; // 总的页数
        this.cinemaList = []; //Users 数据


        // 定义需要用到的 dom 对象
        this.dom = {
            table: $("#cinema_body tbody"), //table 的 tbody
            pagination: $(".pagination"), // 分页的 ul
            addModal: $("#addModal"), //新增的模态框 
            nameInput: $("#inputEmail3"), //名字输入框
            addressInput: $("#inputPassword3"), //地址 输入框
            submitAdd: $("#addCinema"), //模态框提交按钮
        }
    }

    // 新增方法
    Cinema.prototype.add = function () {
        var that = this;
        $.post('/cinema/add', {
            name: this.dom.nameInput.val(),
            address: this.dom.addressInput.val()
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
            that.dom.addressInput.val('');
        });
    }


    // 查询方法
    Cinema.prototype.search = function () {
        var that = this;
        $.get('/cinema/search', {
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }, function (result) {
            if (result.code === 0) {
                layer.msg('查询成功');
                // 将result.data 写入到 实例的 usersLIst
                that.cinemaList = result.data;
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
    Cinema.prototype.renderTable = function () {
        this.dom.table.html('');
        for (var i = 0; i < this.cinemaList.length; i++) {
            var item = this.cinemaList[i];
            this.dom.table.append(
                `
                <tr>
                <td>${item._id}</td>
                <td>${item.name}</td>
                <td>${item.address}</td>
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
    Cinema.prototype.renderPage = function () {
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
    // 所有的dom操作都在这里
    Cinema.prototype.bidDOM = function () {
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
        var cinema = new Cinema();
        cinema.bidDOM();
        cinema.search(); //默认渲染第一页
    })
})();