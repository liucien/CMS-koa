const Koa = require('koa');
const router = require('koa-router')();
const render = require('koa-art-template');
const path = require('path');
const static = require('koa-static');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const sd = require('silly-datetime');
const jsonp = require('koa-jsonp')
const app = new Koa();

//配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat=function(value){
        //设置日期格式
        return sd.format(new Date(value), 'YYYY-MM-DD HH:mm');
    } /*扩展模板里面的方法*/
});

app.use(jsonp())
//配置静态资源中间件
app.use(static(__dirname + '/public'));

//配置post中间件
app.use(bodyParser());

//配置session
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: true,/**每次请求都设置session*/
    renew: false,
};

app.use(session(CONFIG, app))

//配置路由分发
const index = require('./routes/index');
const api = require('./routes/api');
const admin = require('./routes/admin');

router.use('/admin', admin);
router.use('/api', api);
router.use(index);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3888);
console.log('项目启动');