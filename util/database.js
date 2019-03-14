const MongoDB = require('mongodb');

const MongoClient = MongoDB.MongoClient;
const url = 'mongodb+srv://Ambika:Dec@1986@cluster0-btzl5.mongodb.net/shop?retryWrites=true';
let db;
const mongoConnect = callback=> {
    MongoClient.connect(url, { useNewUrlParser: true }).then(client =>{
        console.log('connected');
        db = client.db('test');
        callback()
    }).catch((err)=>{
        console.log(err);
    })
}

const getDB = () => {
    if(db){
        return db;
    }  
    else{
        console.log('not connect with database')
    }  
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;