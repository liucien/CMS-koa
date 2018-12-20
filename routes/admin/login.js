const router = require('koa-router')();
const tools = require('../../model/tools.js');
const DB = require('../../model/db.js');

router.get('/', async ctx => {
    await ctx.render('admin/login')
});
router.post('/doLogin', async ctx => {
    let userName = ctx.request.body.userName;
    let password = ctx.request.body.password;
    let result = await DB.find('admin',{userName:userName,password:tools.md5(password)});

    if(result){
        ctx.session.userinfo = result[0];
        ctx.redirect(ctx.state.__HOST__ + '/admin')
    }else{
        console.log(result)
    }
});

module.exports = router.routes();