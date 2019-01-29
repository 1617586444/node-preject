// 页面渲染的路由

const express = require('express');
const path = require('path');
const router = express.Router();
const  infoFilm =require('../models/bannerModel');
const  usersInfo =require('../models/usersModel');
const  cinemaInfo =require('../models/cinemaModel');
const userCheck = require('../middlewares/userCheck');

// 首页 -http://localhost:3000/
router.get('/', userCheck ,(req,res) => {
    // 要获取用户登录的用户名
    let nickName = req.cookies.nickName;
    let isAdmin = req.cookies.isAdmin ? true : false
    res.render('index.ejs',{
        nickName: req.cookies.nickName,
        isAdmin: parseInt(req.cookies.isAdmin)
    })
});
// 用户管理页面
router.get('/users.html', userCheck ,(req,res) =>{
    let nickName = req.cookies.nickName;
    let isAdmin = req.cookies.isAdmin ? true : false
    res.render('users.ejs',{
        nickName: req.cookies.nickName,
        isAdmin: parseInt(req.cookies.isAdmin)
    })
})

// 设置 film 影片管理页面

router.get('/film.html' ,userCheck ,(req,res) =>{
    let nickName = req.cookies.nickName;
    let isAdmin = req.cookies.isAdmin ? true : false
    res.render('film.ejs',{
        nickName: req.cookies.nickName,
        isAdmin: parseInt(req.cookies.isAdmin)
    })
})
// 设置 cinema 影院管理页面

router.get('/cinema.html' ,userCheck ,(req,res) =>{
    let nickName = req.cookies.nickName;
    let isAdmin = req.cookies.isAdmin ? true : false
    res.render('cinema.ejs',{
        nickName: req.cookies.nickName,
        isAdmin: parseInt(req.cookies.isAdmin)
    })
})


// 设置 banner 页面
router.get('/banner.html',userCheck,(req,res) => {
    let nickName = req.cookies.nickName;
    let isAdmin = req.cookies.isAdmin ? true : false
    res.render('banner.ejs',{
        nickName: req.cookies.nickName,
        isAdmin: parseInt(req.cookies.isAdmin)
    })
}); 

// 设置登录页面
router.get('/login.html',(req,res) =>{
    let nickName = req.cookies.nickName;
    let isAdmin = req.cookies.isAdmin ? true : false
    //res.clearCookie('name');  name 是需要清掉的名字
    res.clearCookie('isAdmin');
    res.clearCookie('nickName');
    res.render('login.ejs');
    
}) 

// 设置注册页面
router.get('/register.html',(req,res) =>{
    res.render('register.ejs')
})


// 修改数据库数据
module.exports = router;