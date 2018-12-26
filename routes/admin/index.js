const router = require('koa-router')();
const DB = require('../../model/db.js');

router.get('/', async ctx => {
    ctx.render('admin/index')
});

router.get('/changeStatus', async ctx => {
    /*数据库*/
    let collectionName = ctx.query.collectionName;
    /*属性*/
    let attr = ctx.query.attr;
    /*更新的 id*/
    let id = ctx.query.id;

    let data = await DB.find(collectionName, {"_id": DB.getObjectId(id)});
    if (data.length > 0) {
        let json = {};
        if (data[0][attr] === 1) {
            json = {
                /*es6 属性名表达式*/
                [attr]: 0
            };
        } else {
            json = {
                [attr]: 1
            };
        }
        let updateResult = await DB.update(collectionName, {"_id": DB.getObjectId(id)}, json);

        if (updateResult) {
            ctx.body = {"message": '更新成功', "success": true};
        } else {
            ctx.body = {"message": "更新失败", "success": false}
        }
    } else {
        ctx.body = {"message": '更新失败,参数错误', "success": false};
    }
});

router.get('/remove', async ctx => {
    /*数据库*/
    try{
        let collection = ctx.query.collection;
        /*删除的 id*/
        let id = ctx.query.id;
        let data = await DB.remove(collection, {"_id": DB.getObjectId(id)});
        ctx.redirect(ctx.state.G.prevPage)
    }catch (err) {
        ctx.redirect(ctx.state.G.prevPage)
    }
});

module.exports = router.routes();