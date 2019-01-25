// 提供给ajax 接口地址 url

const async = require('async');
const express = require('express');
const UsersModel = require('../models/usersModel.js');
const router = express.Router();


// 注册 - http:localhost:3000/users/register/
router.post('/register', (req, res) => {
    //1. 得到数据 前端传递过来的参数名和表中的字段名一样
    let userName = req.body.userName;
    let password = req.body.password;
    let nickName = req.body.nickName;
    // 2.实例化用户对象 
    console.log(userName,password,nickName)
    let users = new UsersModel({
        userName: req.body.userName,
        password: req.body.password,
        nickName: req.body.nickName
    });

    // 3. save 方法
    users.save().then(() => {
        res.json({
            code: 0,
            msg: '注册成功'
        })
    }).catch(error => {
        res.json({
            code: -1,
            msg: error.message
        })
    })
})

// 登录 /users/login
router.post('/login',(req,res) =>{
    // 得到前端的用户名密码
    let userName = req.body.userName;
    let password = req.body.password;
    // 2.数据库查询用户
    UsersModel.findOne({
        userName,
        password
    }).then(data =>{
        console.log(data);
        // 判断如果存在 data 有值  不存在 null
        if(!data){
            res.json({
                code:-1,
                msg:'用户名或密码错误' 
            })
        } else {
            // 先设置 cookie
            // 返回数据
            res.cookie('nickName',data.nickName,{
                maxAge: 1000 * 60 * 100
            })

            if(data.isAdmin) {
                res.cookie('isAdmin', data.isAdmin ,{
                    maxAge: 1000 * 60 * 100
                });
            }
            res.json({
                code:0,
                msg:'登录成功',
                data:{
                    id:data._id,
                    nickName:data.nickName,
                    idAdmin:data.isAdmin
                }
            })
        }
    }).catch(error =>{
        res.json({
            code:-1,
            msg:error.message
        })
    })
})


// 退出登录 
router.post('/login',(req,res) =>{
    res.clearCookie('isAdmin');
})


// 添加 用户信息 - http://localhost:3000/users/add
router.post('/add',(req,res) =>{
    // 获取前端传过来的数据
    var users = new UsersModel({
        name:req.body.usersName,
        password:req.body.password
    });

    users.save(function(err){
        if(err){
            // 失败  
            res.json({
                code:-1,
                msg:err.message
            })
        } else {
        // 成功
            res.json({
                code:0,
                msg:'ok'
            })
        }

    })


}); 

// 删除信息 http://localhost:3000/users/delete
router.post('/delete', (req, res) => {
    // 获取前端传过来的ID
    var infoId = req.body.id;
    console.log(infoId)
    UsersModel.deleteOne({
        _id: infoId
    }, function (err, data) {
        if (err) {
            console.log('删除失败');
        } else {
            console.log('删除成功')
        }
    })
})

// 修改 信息  http://localhost:3000/users/change

router.post('/change', (req, res) => {
    // 获取前端传过来的数据
    var id = req.body.id;
    var usersName = req.body.usersName;
    var password = req.body.password;

    console.log(usersName)
    console.log(password)
    UsersModel.updateOne({
        _id: id
    }, {
        $set: {
            name: usersName,
            password: password
        }
    }, function (err, data) {
        console.log(err, data)
    })
})



// 检索或者查询 http://localhost:3000/users/search

router.get('/search', (req, res) => {
    // 分页
    // 1 从前端的到传过来的数据
    let pageNum = parseInt(req.query.pageNum) || 1; // 当前页数
    let pageSize = parseInt(req.query.pageSize) || 2; // 每页显示条数


    // 采用并行无关联
    async.parallel([
        function (cb) {
            UsersModel.find().count().then(num => {
                cb(null, num);
            }).catch(err => {
                cb(err);
            })
        },
        function (cb) {
            UsersModel.find().skip(pageNum * pageSize - pageSize).limit(pageSize)
                .then(data => {
                    cb(null, data);
                }).catch(err => {
                    cb(err);
                })
        }
    ], function (err, result) {
        console.log(result);
        if (err) {
            res.json({
                code: -1,
                msg: err.message
            });
        } else {
            res.json({
                code: 0,
                msg: 'ok',
                data: result[1],
                totalPage: Math.ceil(result[0] / pageSize)
            });
        }
    })


})
module.exports = router;