const db = require('../config/db');

const schema = new db.Schema({
    name:String,
    imgUrl:String
}); 

module.exports = db.model('banner',schema);