const db = require('../config/db');

const schema = new db.Schema({
    name:{
        type:String,
        default:'英皇电影城（东海缤纷店）'
    },
    address:{
        type:String,
        default:'东海国际中心二期B区101之B1002号商铺'
    }
}); 

module.exports = db.model('cinema',schema);