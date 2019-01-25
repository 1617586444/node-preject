// 项目入口文件
const express = require('express');
const app = express();
const cookieP = require('cookie-parser');
const path = require('path');



// 引入的路由中间的文件
const indexRouter = require('./routes/indexRoute');
const bannerRouter = require('./routes/bannerRoute');
const usersRouter = require('./routes/usersRoute');
const filmRouter = require('./routes/filmRoute');
// 使用中间件 -cookie
app.use(cookieP());
app.use(express.json());
app.use(express.urlencoded({ extended:true}));

// 设置 静态文件托管
app.use(express.static(path.resolve(__dirname,'./public')));

// 设置模板文件的路径使用的什么模板
app.set('views',path.resolve(__dirname,'./views'));
app.set('views engine' ,'ejs');

// 路由中间件的使用
app.use('/',indexRouter);
app.use('/banner',bannerRouter);
app.use('/users',usersRouter);
app.use('/film',filmRouter);



app.listen(3000);