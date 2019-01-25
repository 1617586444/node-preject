1.cookie 可以设置过期时间
2.localStorage 你除非 主动删除
3.sessionStorage 关闭浏览器就会删除
4.cookie 是有大小限制，4kb  5md 
5.cookie 会随着http请求自动发送给服务器



删除cookie
res.clearCookie('id')