const db = require('../config/db');

const schema = new db.Schema({
    filmName:{          //电影名 死侍2：我爱我家
        type:String,
        default:'死侍2：我爱我家'
    }, 
    director:{
        type:String,    //电影类型   喜剧|动作|科幻|冒险
        default:'喜剧|动作|科幻|冒险'
    }, 
    category:{          //导演 大卫·雷奇
        type:String,
        default:'大卫·雷奇'
    }, 
    filmType:{              //影片类型 
        type: String,
        default:'2D'         //'2D',
    },
    grade: {             // 7.4  评分
        type:Number,
        default:7.4
    },      
    language: {          // "英语"
        type:String,
        default:'英语'
    },        
    nation: {            //"美国"
        type:String,
        default:'美国'
    },             
    synopsis:{          //影片简介 
        type:String,
        default:'漫威史上最贱的雇佣兵死侍再度归来！本与女友过着幸福生活的死侍'
    }
}); 

module.exports = db.model('film',schema);