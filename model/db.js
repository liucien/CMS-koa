const MongoDB=require('mongodb');
const MongoClient = MongoDB.MongoClient;
const ObjectID = MongoDB.ObjectID;
const Config = require('./config.js');

class Db {
    static getInstance() { /** 单例 解决多次实例化实例不共享问题 */
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;

    }

    constructor() {
        this.dbClient = '';
        this.connect();
        console.log('数据库连接')
        /** 实例化时连接数据库 */
    }

    connect() { //连接数据库
        return new Promise((resolve, reject) => {
            if (!this.dbClient) {
                /** 解决数据库多次连接问题 */
                MongoClient.connect(Config.dBUrl, (err, client) => {
                    if (err) {
                        reject(err)
                    } else {
                        this.dbClient = client.db(Config.dbName);
                        resolve(this.dbClient);
                    }
                });
            } else {
                resolve(this.dbClient)
            }
        })
    }

    find(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                let result = db.collection(collectionName).find(json);
                result.toArray((err, docs) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(docs)
                    }
                })
            })
        })
    }

    update(collectionName,json1,json2) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).updateOne(json1,{
                    $set:json2
                },(err,result) => {
                    if(err) {
                        reject(err)
                    }else{
                        resolve(result)
                    }
                })
            })
        })
    }

    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).insertOne(json, (err,result) => {
                    if(err) {
                        reject(err)
                    }else{
                        resolve(result)
                    }
                })
            })
        })
    }

    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).removeOne(json, (err,result) => {
                    if(err) {
                        reject(err)
                    }else{
                        resolve(result)
                    }
                })
            })
        })
    }

    getObjectId(id){
        return new ObjectID(id)
    }
}

module.exports = Db.getInstance();
