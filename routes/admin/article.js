const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');

router.get('/', async ctx => {
    let page = ctx.query.page || 1;
    let pageSize = 3;
    let result = await DB.find('article',{},{},{
        page,pageSize
    });
    let count = await DB.count('article',{});

    await ctx.render('admin/article/index',{
        list:result,
        totalPages:Math.ceil(count/pageSize),
        page:page
    })
});

router.get('/add', async ctx => {
    let result = await DB.find('article',{pid:'0'});
    await ctx.render('admin/article/add',{
        catelist:result
    })
});

router.post('/doAdd', async ctx => {
    let addData = ctx.request.body;
    DB.insert('article',addData);
    ctx.redirect(ctx.state.__HOST__ + '/admin/article')
});

router.get('/edit', async ctx => {
    let id = ctx.query.id;
    let result = await DB.find('article',{_id:DB.getObjectId(id)});
    let article = await DB.find('article',{pid:'0'});
    await ctx.render('admin/article/edit',{
        list:result[0],
        catelist:article
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
    await DB.update('article',{_id:DB.getObjectId(id)},{
        title,pid,keywords,status,description
    });
    ctx.redirect(ctx.state.__HOST__ + '/admin/article')
});

router.get('/delete', async ctx => {
    ctx.body = '删除用户'
});

module.exports = router.routes();