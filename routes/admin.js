const router = require('koa-router')();
const login = require('./admin/login');
const user = require('./admin/user');

//配置中间件获取url
router.use(async (ctx, next) =>{
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;
    //权限判断是否登陆
    if(ctx.session.userinfo){
        await next();
    }else{
        if(ctx.url === '/admin/login' || ctx.url === '/admin/login/doLogin'){
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