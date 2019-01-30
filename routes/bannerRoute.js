// 提供给前端调用ajax 接口地址 url

const async = require('async');
const express = require('express');
const BannerModel = require('../models/bannerModel');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
    dest: 'h:/tmp'
})

// 模糊搜索信息 http://localhost:3000/banner/seek
router.post('/seek', (req, res) => {
    // 接收前端发来的数据
    let filmName = new RegExp(req.body.filmName)
    // console.log(filmName)
    BannerModel.find({
        'name': filmName
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

// 添加 banner - http://localhost:3000/banner/add
router.post('/add', upload.single('bannerImg'), (req, res) => {
    // 1 操作文件
    let nweFileName = new Date().getTime() + '_' + req.file.originalname;
    let newFilePath = path.resolve(__dirname, '../public/uploads/banners/', nweFileName)

    // 文件名字 + banner图的名字给写入到数据库中

    var banner = new BannerModel({
        name: req.body.bannerName,
        imgUrl: 'http://localhost:3000/uploads/banners/' + nweFileName
    })

    banner.save().then(() => {
        res.json({
            code: 0,
            msg: 'ok'
        }).catch(error => {
            res.json({
                code: -1,
                msg: error.massage
            })
        })
    })

    // 移动文件
    try {
        let data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newFilePath, data);
        fs.unlinkSync(req.file.path);
    } catch (error) {
        res.json({
            code: -1,
            msg: error.massage
        })
    }

});

// 修改 信息  http://localhost:3000/banner/change
router.post('/change', (req, res) => {
    // 获取前端传过来的数据
    var id = req.body.id;
    var namechg = req.body.bannerName;
    var imgUrlchg = req.body.bannerUrl;
    BannerModel.updateOne({
        _id: id
    }, {
        $set: {
            name: namechg,
            imgUrl: imgUrlchg
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

// 删除信息 http://localhost:3000/banner/delete
router.post('/delete', (req, res) => {
    // 获取前端传过来的ID
    var id = req.body.id;
    // 操作删除 BannerModel 第二种方法
    BannerModel.findByIdAndDelete({
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


// 检查搜索或查询 http://localhost:3000/banner/search
router.get('/search', (req, res) => {
    // 分页
    // 1 从前端得到传递过来的参数
    let pageNum = parseInt(req.query.pageNum) || 1; // 当前页数
    let pageSize = parseInt(req.query.pageSize) || 2; // 每页显示条数

    // 采用并行无关联
    async.parallel([
        function (cb) {
            BannerModel.find().count().then(num => {
                cb(null, num);
            }).catch(err => {
                cb(err);
            })
        },
        function (cb) {
            BannerModel.find().skip(pageNum * pageSize - pageSize).limit(pageSize)
                .then(data => {
                    cb(null, data);
                }).catch(err => {
                    cb(err);
                })
        }
    ], function (err, result) {
        // console.log(result);
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