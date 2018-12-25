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
    let result = await DB.find('articlecate',{pid:'0'});
    await ctx.render('admin/articlecate/add',{
        catelist:result
    })
});

router.post('/doAdd', async ctx => {
    let addData = ctx.request.body;
    DB.insert('articlecate',addData);
    ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')
});

router.get('/edit', async ctx => {
    let id = ctx.query.id;
    let result = await DB.find('articlecate',{_id:DB.getObjectId(id)});
    let articlecate = await DB.find('articlecate',{pid:'0'});
    await ctx.render('admin/articlecate/edit',{
        list:result[0],
        catelist:articlecate
    })
});

router.post('/doEdit', async ctx => {
    let editData = ctx.request.body;
    let id = editData.id;
    let title = editData.title;
    let pid = editData.pid;
    let keywords = editData.keywords;
    let status = editData.status;
    let description = editData.description;
    await DB.update('articlecate',{_id:DB.getObjectId(id)},{
        title,pid,keywords,status,description
    });
    ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')
});

router.get('/delete', async ctx => {
    ctx.body = '删除用户'
});

module.exports = router.routes();