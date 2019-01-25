const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/mz';


mongoose
    .connect(url, {useNewUrlParser:true})
    .then(() =>{
        console.log('连接成功');
    })
    .catch((err) =>{
        console.log('连接失败',err.message)
    });

    // 将 mongoose 暴露出去
    module.exports = mongoose;