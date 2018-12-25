const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');

router.get('/', async ctx => {
    let result = await DB.find('articlecate',{});
    await ctx.render('admin/articlecate/index',{
        list:tools.cateToList(result)
    })
});

router.get('/add', async ctx => {
    await ctx.render('admin/user/add')
});

router.get('/edit', async ctx => {
    ctx.body = '编辑用户'
});

router.get('/delete', async ctx => {
    ctx.body = '删除用户'
});

module.exports = router.routes();