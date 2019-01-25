const db = require('../config/db');

const schema = new db.Schema({
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    nickName:{
        type:String,
        default:'普通用户'
    },
    isAdmin:{
        type:Number,
        default:0
    }
}); 

module.exports = db.model('user',schema);