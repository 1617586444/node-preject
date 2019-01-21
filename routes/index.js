// 页面渲染的路由

const express = require('express');
const router = express.Router();

// 首页 -http://localhost:3000/
router.get('/',(req,res) => {
    res.render('index.ejs')
});

// 设置 banner 页面

router.get('/banner.html',(req,res) => {
    res.render('banner.ejs')
})

module.exports = router;