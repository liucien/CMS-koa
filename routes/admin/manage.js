const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');

router.get('/', async ctx => {
    let result = await DB.find('admin', {});
    await ctx.render('admin/manage/list', {
        list: result
    })
});

router.get('/add', async ctx => {
    await ctx.render('admin/manage/add')
});

router.post('/doAdd', async ctx => {
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;
    let result = await DB.find('admin', {username: username});
    if (result.length > 0) {
        ctx.render('admin/error', {
            message: '管理员已存在，请重新名命',
            redirect: ctx.state.__HOST__ + '/admin/manage/add'
        })
    } else {
        let addResult = await DB.insert('admin',
            {
                username: username,
                password: tools.md5(password),
                state: 1,
                last_time: ''
            }
        );
        ctx.render('admin/manage/list', {
            list: await DB.find('admin', {})
        })

    }
});

router.get('/edit', async ctx => {
    let id = ctx.query.id;
    let result = await DB.find('admin', {_id: DB.getObjectId(id)});
    ctx.render('admin/manage/edit', {
        list: result[0]
    })
});

router.post('/doEdit', async ctx => {
    let id = ctx.request.body.id;
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let rpassword = ctx.request.body.rpassword;
    if (password !== '') {
        //更新密码
        await DB.update('admin',{_id:DB.getObjectId(id)},{
            password:tools.md5(password)
        })
    }
    ctx.redirect(ctx.state.__HOST__ + '/admin/manage')
});


module.exports = router.routes();