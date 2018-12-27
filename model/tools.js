/**
 * Created by Administrator on 2018/3/21 0021.
 */
var md5 = require('md5');
const multer = require('koa-multer');
let tools={
    multer(){
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/upload')
            },
            filename: function (req, file, cb) {
                var fileFormat = (file.originalname).split(".");   /*��ȡ��׺��  �ָ�����*/
                cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
            }
        })
        var upload = multer({ storage: storage });
        return upload

    },
    getTime(){

        return new Date()
    },
    md5(str){
        return md5(str)
    },
    cateToList(data){

        var firstArr=[];

        for(var i=0;i<data.length;i++){
            if(data[i].pid=='0'){
                firstArr.push(data[i]);
            }
        }
        for(var i=0;i<firstArr.length;i++){

            firstArr[i].list=[];
            for(var j=0;j<data.length;j++){
                if(firstArr[i]._id==data[j].pid){
                    firstArr[i].list.push(data[j]);
                }
            }

        }

        return firstArr;
    }
}

module.exports=tools;