const router = require('koa-router')();
const tools = require('../../model/tools.js');
const DB = require('../../model/db.js');

const svgCaptcha = require('svg-captcha');//验证码

router.get('/', async ctx => {
    await ctx.render('admin/login')
});

router.post('/doLogin', async ctx => {
    let userName = ctx.request.body.userName;
    let password = ctx.request.body.password;
    let code = ctx.request.body.code;
    if (code.toLocaleLowerCase() === ctx.session.code.toLocaleLowerCase()) {
        let result = await DB.find('admin', {userName: userName, password: tools.md5(password)});

        if (result) {
            ctx.session.userinfo = result[0];
            ctx.redirect(ctx.state.__HOST__ + '/admin')
        } else {
            ctx.render('admin/error', {
                message: '用户名或密码错误',
                redirect: ctx.state.__HOST__ + '/admin/login'
            })
        }

    } else {
        ctx.render('admin/error', {
            message: '验证码校验失败',
            redirect: ctx.state.__HOST__ + '/admin/login'
        })
    }

});

//验证码
router.get('/code', async ctx => {
    const captcha = svgCaptcha.create({
        size: 4,
        fontSize: 30,
        width: 100,
        height: 40,
        background: ''
    });

    ctx.session.code = captcha.text;//保存验证码

    ctx.response.type = 'image/svg+xml';//设置响应头

    ctx.body = captcha.data;
});
module.exports = router.routes();