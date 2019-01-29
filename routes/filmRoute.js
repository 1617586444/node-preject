// 提供给ajax 接口地址 url

const async = require('async');
const express = require('express');
const FilmModel = require('../models/filmModel.js');
const router = express.Router();



// 模糊搜索 http://localhost:3000/film/seek

router.post('/seek', (req, res) => {
    // 接收前端发来的数据
    let filmName = new RegExp(req.body.filmName)
    // console.log(filmName)
    FilmModel.find({
        filmName: filmName
    }).then((data) => {
        // console.log(data)
        if (data == '') {
            res.json({
                code: 1,
                msg: '您搜索的电影不存在!'
            })
        } else {
            res.json({
                code: 0,
                msg: 'ok',
                rel:data
            })
        }
    }).catch(error => {
        res.json({
            code: -1,
            msg: error.message
        })
    })
})


// 添加信息 - http://localhost:3000/film/add

router.post('/add', (req,res) =>{
    // 接收前端传过来的数据
    var film = new FilmModel({
        filmName:  req.body.filmName,
        director:  req.body.director,
        category:  req.body.category,
        filmType:  req.body.filmType,
        grade:  req.body.grade,
        language:  req.body.language,
        nation:  req.body.nation,
        synopsis:  req.body.synopsis,
        poster: req.body.poster
    });
    film.save().then(() =>{
        res.json({
            code:0,
            msg:'加入成功'
        })
    }).catch(error =>{
        res.json({
            code:-1,
            msg:error.message
        })
    })
})

// 检查或者查询  http://localhost:3000/film/search
router.get('/search', (req,res) => {
    // 分页
    // 1 从前端得到传递过来的参数
    let pageNum = parseInt(req.query.pageNum) || 1; // 当前页数
    let pageSize = parseInt(req.query.pageSize) || 2; // 每页显示条数
    
    // 采用并行无关联
    async.parallel([
        function(cb){
            FilmModel.find().count().then(num =>{
            cb(null,num);
          }).catch(err =>{
              cb(err);
          })
        },
        function(cb){
            FilmModel.find().skip( pageNum * pageSize - pageSize).limit(pageSize)
              .then(data =>{
                cb(null,data);
            }).catch(err =>{
                cb(err);
            })
        }
    ],function(err,result){
        if(err){
          res.json({
            code:-1,
            msg:err.message
          });
        } else{
            res.json({
                code:0,
                msg:'ok',
                data:result[1],
                totalPage: Math.ceil(result[0] / pageSize)
            });
          }
     })
    
    })
    



module.exports = router;
