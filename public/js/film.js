(function () {
    /**
     * 定义这个文件的构造函数
     */

    var Film = function () {
        // 定义页面需要的数据
        this.pageNum = 1; // 当前的页面数   
        this.pageSize = 3; //每页显示的条数
        this.totalPage = 0; // 总的页数
        this.filmList = []; //Users 数据
        this.seekList = []; //搜索出来的 数据
        // 需要用的的 dom 对象

        this.dom = {
            table: $("#users_table tbody"), //table 的 tbody
            pagination: $(".pagination"), // 分页的 ul
            nameInput: $("#inputEmail3"), //名字输入框
            urlInput: $("#inputPassword3"), //url 输入框
            inputEmail3: $("#inputEmail3"), //电影名
            inputPoster3: $("#inputPoster3"), //电影海报
            inputDirector3: $("#inputDirector3"), //影片类型
            inputCategory3: $("#inputCategory3"), //导演
            inputType3: $("#inputType3"), //电影类型
            inputGrade3: $("#inputGrade3"), //评分
            inputLanguage3: $("#inputLanguage3"), //语言
            inputNation3: $("#inputNation3"), //国家
            inputSynopsis3: $("#inputSynopsis3"), //电影简介
            addFilmBtn: $("#addFilm"), //确认添加
            addModal: $("#addModal"), // 新增按钮
            searchFilm: $(".searchFilm"), // 搜索框
            searchBtn: $(".btn-search"), // 搜索按钮
            ul: $(".nowPlayingList"), // 搜索按钮
        }

        // 模糊搜索的方法
        Film.prototype.seekInfo = function () {
            var that = this;
            var searchVal = this.dom.searchFilm.val() || ' ';
            $.post('/film/seek', {
                filmName: searchVal
            }, function (result) {
                if (result.code === 0) {
                    layer.msg('搜索成功');
                    // 将数据装到 seekList
                    that.seekList = result.rel;
                    console.log(that.seekList)

                    // 调用渲染数据方法
                    that.seekPage();
                    // 清空输入框的这
                    that.dom.searchFilm.val('')
                } else if (result.code === 1) {
                    // 渲染一下数据
                    that.dom.ul.html('');
                    that.dom.ul.append(
                        `
                        <li style="line-height:30px; padding-left:10px; color:red">您搜索的电影不存在!</li>
                        `
                    )
                }
            })
        }

        // 新增信息的方法
        Film.prototype.add = function () {
            var that = this;
            $.post('/film/add', {
                filmName: this.dom.inputEmail3.val(),
                director: this.dom.inputDirector3.val(),
                category: this.dom.inputCategory3.val(),
                filmType: this.dom.inputType3.val(),
                grade: this.dom.inputGrade3.val(),
                language: this.dom.inputLanguage3.val(),
                nation: this.dom.inputNation3.val(),
                synopsis: this.dom.inputSynopsis3.val(),
                poster: this.dom.inputPoster3.val(),
            }, function (res) {
                if (res.code === 0) {
                    // 成功
                    layer.msg('加入成功');
                    that.search();
                    // 重新请求
                    that.search();
                } else {
                    layer.msg('网络异常，请稍后重试');
                }
                // 手动关闭模态框
                that.dom.addModal.modal('hide');
                that.dom.inputEmail3.val(''),
                    that.dom.inputDirector3.val(''),
                    that.dom.inputCategory3.val(''),
                    that.dom.inputType3.val(''),
                    that.dom.inputGrade3.val(''),
                    that.dom.inputLanguage3.val(''),
                    that.dom.inputNation3.val(''),
                    that.dom.inputSynopsis3.val(''),
                    that.dom.inputPoster3.val('')
            });

        }
          /**
     * 渲染搜索结果
     * 
     */

    Film.prototype.seekPage = function () {
        this.dom.ul.html('');
        for (var i = 0; i < this.seekList.length; i++) {
            var item = this.seekList[i];
            this.dom.ul.append(
                `
                <li style="overflow: hidden; border-bottom:1px solid #ccc;">
                    <div  class="lazy-img nowPlayingFilm-img" alt="film" style="width: 66px; height: 94px; background: rgb(249, 249, 249); float: left;">
                        <div data-v-fa55ebd6="" class="padding" style="width: 66px; height: 94px; background: rgb(249, 249, 249);"><img
                                data-v-fa55ebd6="" src="${item.poster}"
                                width="64px" alt="img"></div>
                        <div></div>
                    </div>
                    <div class="nowPlayingFilm-info " style="float: left;">
                        <div class=""><span class="name">电影名字：${item.filmName}</span><br/><span
                                class="item">影片类型：2D</span></div>
                        <div class="nowPlayingFilm-grade info-col" style="visibility: visible;"><span class="label newInfo">观众评分
                            </span><span class="grade">${item.grade}</span></div>
                        <div class="nowPlayingFilm-actors info-col newInfo"><span class="label newInfo">导演：${item.category}</span></div>
                        <div class="nowPlayingFilm-detail info-col"><span class="label newInfo">${item.nation} | 119分钟</span></div>
                    </div>
                </li>
                `
            )
        }
    }


        // 查询的方法
        Film.prototype.search = function () {
            var that = this;
            $.get('/film/search', {
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }, function (result) {
                if (result.code === 0) {
                    layer.msg('查询成功');
                    // 将result.data 写入到 实例的 usersLIst
                    that.filmList = result.data;
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
        Film.prototype.renderTable = function () {
            this.dom.table.html('');
            for (var i = 0; i < this.filmList.length; i++) {
                var item = this.filmList[i];
                this.dom.table.append(
                    `
                    <tr>
                    <td>${item._id}</td>
                    <td>${item.filmName}</td>
                    <td><img src="${item.poster}"/></td>
                    <td>${item.director}</td>
                    <td>${item.category}</td>
                    <td>${item.filmType}</td>
                    <td>豆瓣：${item.grade} 分</td>
                    <td>${item.language}</td>
                    <td>${item.nation}</td>
                    <td>${item.synopsis}</td>
                    </td>
                `
                )
            };

        }
        /**
         * 渲染分页
         */
        Film.prototype.renderPage = function () {
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
        Film.prototype.bidDOM = function () {
            var that = this;
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
            // 点击确认新增按钮调用 add();
            this.dom.addFilmBtn.click(function () {
                that.add();
            })
            // 点击搜索按钮
            this.dom.searchBtn.click(function () {
                // alert(that.dom.searchInput.val())
                that.seekInfo();
            })
        }
    }
    // 最后
    $(function () {
        var film = new Film();
        film.bidDOM();
        film.search(); //默认渲染第一页
    })

})();