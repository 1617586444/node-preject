(function () {
    var Users = function () {
        this.btnLock = false; //登录按钮的锁

        this.dom = {
         submitBtn:$("#btn"),
         userNameInput:$("#disabledTextInput"),
         passwordInput:$("#disabledSelect"),
        }
    }

    Users.prototype.bindDOM = function () {
        var that = this;
       this.dom.submitBtn.click(function(){
        //   发送ajax前 先判断是否有锁
            if(!that.btnLock){
                // 没锁时 加锁
                that.btnLock = true;
                that.handLogin();
            }
       })
    }

    /**
     * 登录方法 调用ajax 
     */
    Users.prototype.handLogin = function () {
        var that = this;
        $.post('/users/login',{
            userName:this.dom.userNameInput.val(),
            password:this.dom.passwordInput.val()
        },function(res){
            if(res.code === 0){
                // 登录成功
                layer.msg('登录成功');
                // 跳转到首页
                setTimeout(function(){
                    window.location.href="/";
                },1000)
            } else {
                // 登录失败
                layer.msg(res.msg);
            }
            // 记得解锁
            that.btnLock = false;
        })
    }


    // 最后 实例化 users()

    new Users().bindDOM();
})();