const router = require('koa-router')();
const login = require('./admin/login');
const user = require('./admin/user');
const url = require('url');
//配置中间件获取url
router.use(async (ctx, next) =>{
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;
    let pathName = url.parse(ctx.request.url).pathname;
    //权限判断是否登陆
    if(ctx.session.userinfo){
        await next();
    }else{
        if(pathName === '/admin/login' || pathName === '/admin/login/doLogin' || pathName === '/admin/login/code'){
            await next();
        }else{
            ctx.redirect('/admin/login')
        }
    }
});

router.get('/', async ctx => {
    ctx.render('admin/index')
});

router.use('/login', login);
router.use('/user', user);

module.exports = router.routes();