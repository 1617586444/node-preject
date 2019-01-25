const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 调用 multer 得到一个 upload 对象
// upload 对象方法很多
// upload.single('input-name-val') 单个文件上传  返回的是中间件函数
// upload.array('input-nam-val',maxCount)  多个文件上传，返回的也是一个中间件函数
// upload.fields([{name:'inp-name-val',maxCount:1},{}])  多个文件上传，返回的也是一个中间件函数
const upload = multer({
    dest:'h:/tmp', //设置文件存放目录
})

const app = express();

app.post('/upload', upload.single('avatar'),(req,res) => {
    // res.send(req.file);
    // res.send(req.body)
    // res.send(req.file);

    // 为了要将图片生成一个url地址到客户端页面进行访问
    // 1 将文件移动到当前系项目的public文件夹下
    // 2 对文件名做一些修改

    // 命名规则: 当前时间戳 + '_' + 源文件名
    var newFileName = new Date().getTime() + '_' + req.file.originalname;
    // 新的存放完整路径
    var newFilePath = path.resolve(__dirname + '/public/uploads/' + newFileName);
    try {
        var data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newFilePath,data);
        fs.unlinkSync(req.file.path);
    } catch (error) {
        res.json({
            code:-1,
            msg:error.message
        })
    }
    
})

app.listen(3000);