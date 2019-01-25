(function(){
var Register = function () {
    this.btnLock = false; //登录按钮的锁

    this.dom = {
        submitBtn:$("#btn"),
        userNameInput:$("#regUserName"),
        passwordInput:$("#regPwd"),
        nickNameInput:$("#regNickName"),
    }
}

Register.prototype.bidDOM = function () {
    var that = this;
    this.dom.submitBtn.click(function(){
        //   发送ajax前 先判断是否有锁
            if(!that.btnLock){
                // 没锁时 加锁
                that.btnLock = true;
                that.handRegister();
            }
    })
}

/**
 * 注册方法 调用 ajax
 */ 

Register.prototype.handRegister = function () {
    var that = this;
        $.post('/users/register',{
            userName:this.dom.userNameInput.val(),
            password:this.dom.passwordInput.val(),
            nickName:this.dom.nickNameInput.val()
        },function(res){
            if(res.code === 0){
                // 登录成功
                layer.msg('注册成功');
                // 跳转到登录页
                setTimeout(function(){
                    window.location.href="/login.html";
                },1000)
            } else {
                // 登录失败
                layer.msg(res.msg);
            }
            // 记得解锁
            that.btnLock = false;
        })
}

 // 最后 实例化 Register()

 new Register().bidDOM();
})();