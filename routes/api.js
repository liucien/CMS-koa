const router = require('koa-router')();

router.get('/', async ctx => {
    ctx.body = {
        success:true,
        message:'请求成功'
    }
});
//post请求
router.post('/testPost',async ctx => {
    ctx.body = {
        success:true,
        message:'请求成功'
    }
});
//put请求
router.put('/testPost',async ctx => {
    ctx.body = {
        success:true,
        message:'请求成功'
    }
});
//delete请求
router.delete('/testPost',async ctx => {
    ctx.body = {
        success:true,
        message:'请求成功'
    }
});
module.exports = router.routes();