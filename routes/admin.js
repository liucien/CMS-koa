const router = require('koa-router')();
const url = require('url');
//配置中间件获取url
router.use(async (ctx, next) => {
    ctx.state.__HOST__ = 'http://' + ctx.request.header.host;

    let pathName = url.parse(ctx.request.url).pathname.substring(1);
    //左侧菜单选中
    let splitUrl = pathName.split('/');
    //配置全局信息
    ctx.state.G = {
        url: splitUrl,
        userinfo: ctx.session.userinfo,
        prevPage:ctx.request.headers['referer']
    };

    //权限判断是否登陆
    if (ctx.session.userinfo) {
        await next();
    } else {
        if (pathName === 'admin/login' || pathName === 'admin/login/doLogin' || pathName === 'admin/login/code') {
            await next();
        } else {
            ctx.redirect('/admin/login')
        }
    }
});

const index = require('./admin/index');
const login = require('./admin/login');
const user = require('./admin/user');
const manage = require('./admin/manage');
const articlecate = require('./admin/articlecate');
const article = require('./admin/article');
const focus = require('./admin/focus');
const link = require('./admin/link');
const nav = require('./admin/nav');


// router.get('/', async ctx => {
//     ctx.render('admin/index')
// });

router.use(index);
router.use('/login', login);
router.use('/user', user);
router.use('/manage', manage);
router.use('/articlecate', articlecate);
router.use('/article', article);
router.use('/focus', focus);
router.use('/link', link);
router.use('/nav', nav);


//配置富文本编辑器
const ueditor = require('koa2-ueditor');
router.all('/editorUpload', ueditor(['public', {
    imageAllowFiles: [".png", ".jpg", ".jpeg"],
    imagePathFormat: "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"
}]));
module.exports = router.routes();