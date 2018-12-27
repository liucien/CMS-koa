const MongoDB = require('mongodb');
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

    find(collectionName, json1, json2, json3) {
        let attr = {}, slipNum = 0, pageSize = 0, page = 1, sortJson = {};

        if (arguments.length === 2) {
            attr = {};
            slipNum = 0;
            pageSize = 0;
        } else if (arguments.length === 3) {
            attr = json2;
            slipNum = 0;
            pageSize = 0;
        } else if (arguments.length === 4) {
            attr = json2;
            page = json3.page || 1;
            pageSize = json3.pageSize || 20;
            slipNum = (page - 1) * pageSize;
            if (json3.sortJson) {
                sortJson = json3.sortJson
            }
        } else {
            console.log('传入参数错误')
        }

        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                // let result = db.collection(collectionName).find(json);
                let result = db.collection(collectionName).find(json1, {fields: attr}).skip(slipNum).limit(pageSize).sort(sortJson);

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

    update(collectionName, json1, json2) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).updateOne(json1, {
                    $set: json2
                }, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }

    insert(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).insertOne(json, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }

    remove(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).removeOne(json, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            })
        })
    }

    getObjectId(id) {
        return new ObjectID(id)
    }

    //统计数量的方法
    count(collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                let result = db.collection(collectionName).count(json);
                result.then(count => {
                    resolve(count)
                })
            })
        })
    }
}

module.exports = Db.getInstance();
