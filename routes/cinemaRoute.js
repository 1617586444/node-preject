// 提供给前端调用ajax 接口地址 url

const async = require('async');
const express = require('express');
const CinemaModel = require('../models/cinemaModel');
const router = express.Router();


// 添加信息 http://localhost:3000/cinema/add
router.post('/add', (req, res) => {
  // 获取前端传过来的数据
  var cinema = new CinemaModel({
    name: req.body.name,
    address: req.body.address
  });

  cinema.save(function (err) {
    if (err) {
      // 失败  
      res.json({
        code: -1,
        msg: err.message
      })
    } else {
      // 成功
      res.json({
        code: 0,
        msg: 'ok'
      })
    }

  })
})

// 修改 信息  http://localhost:3000/cinema/update
router.post('/update', (req, res) => {
  // 获取前端传过来的数据
  CinemaModel.updateOne({
    _id: req.body.id
  }, {
    $set: {
      name: req.body.name,
      address: req.body.address
    }
  }, function (err, data) {
    if (err) {
      res.json({
        code: -1,
        msg: err.message
      })
    } else {
      // 成功
      res.json({
        code: 0,
        msg: 'ok'
      })

    }
  })
})

// 删除信息 http://localhost:3000/cinema/delete
router.post('/delete', (req, res) => {
  // 获取前端传过来的ID
  var id = req.body.id;
  // 操作删除 CinemaModel 第二种方法
  CinemaModel.findByIdAndDelete({
    _id: id
  }).then((data) => {
    console.log(data)
    if (data) {
      res.json({
        code: 0,
        msg: 'ok'
      })
    } else {
      res.json({
        code: -1,
        msg: '未找到相关数据'
      })
    }

  }).catch((error) => {
    res.json({
      code: -1,
      msg: error.message
    })
  })
})

// 模糊搜索信息 http://localhost:3000/banner/seek
router.post('/seek', (req, res) => {
  // 接收前端发来的数据
  let name = new RegExp(req.body.name)
  // console.log(filmName)
  CinemaModel.find({
      'name': name
  }).then((data) => {
      // console.log(data)
      if (data == '') {
          res.json({
              code: 1,
              msg: '您搜索的影院不存在!'
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
// 检索或者查询 http://localhost:3000/users/search
router.get('/search', (req, res) => {
  // 分页
  // 1 从前端的到传过来的数据
  let pageNum = parseInt(req.query.pageNum) || 1; // 当前页数
  let pageSize = parseInt(req.query.pageSize) || 2; // 每页显示条数

  // 采用并行无关联
  async.parallel([
    function (cb) {
      CinemaModel.find().count().then(num => {
        cb(null, num);
      }).catch(err => {
        cb(err);
      })
    },
    function (cb) {
      CinemaModel.find().skip(pageNum * pageSize - pageSize).limit(pageSize)
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