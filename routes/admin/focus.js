const router = require('koa-router')();
const DB = require('../../model/db.js');
const tools = require('../../model/tools.js');

const multer = require('koa-multer');
let storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'public/upload/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        let fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
let upload = multer({storage: storage});

router.get('/', async ctx => {
    let page = ctx.query.page || 1;
    let pageSize = 3;
    let result = await DB.find('focus', {}, {}, {
        page,
        pageSize
    });
    let count = await  DB.count('focus', {});
    /*总数量*/
    await  ctx.render('admin/focus/list', {
        list: result,
        page: page,
        totalPages: Math.ceil(count / pageSize)
    });
});

router.get('/add', async ctx => {
    await ctx.render('admin/focus/add')
});

router.post('/doAdd', upload.single('pic'), async ctx => {
    //必须在form中配置enctype="multipart/form-data"
    // ctx.body = {
    //     //返回文件名
    //     filename: ctx.req.file ? ctx.req.file.filename : '',
    //     body: ctx.req.body
    // }

    let title = ctx.req.body.title;

    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : '';

    let url = ctx.req.body.url;

    let sort = ctx.req.body.sort;

    let status = ctx.req.body.status;

    let add_time = tools.getTime();

    await  DB.insert('focus', {

        title, pic, url, sort, status, add_time
    });

    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/focus');
});
//编辑
router.get('/edit', async (ctx) => {
    let id = ctx.query.id;
    let result = await DB.find('focus', {"_id": DB.getObjectId(id)});
    await  ctx.render('admin/focus/edit', {
        list: result[0],
        prevPage: ctx.state.G.prevPage
    });

});
//执行编辑数据
router.post('/doEdit', upload.single('pic'), async (ctx) => {

    let id = ctx.req.body.id;

    let title = ctx.req.body.title;

    let pic = ctx.req.file ? ctx.req.file.path.substr(7) : '';

    let url = ctx.req.body.url;

    let sort = ctx.req.body.sort;

    let status = ctx.req.body.status;

    let add_time = tools.getTime();

    let prevPage = ctx.req.body.prevPage;

    let json = {};
    if (pic) {

        json = {

            title, pic, url, sort, status, add_time
        }
    } else {
        json = {

            title, url, sort, status, add_time
        }

    }
    await  DB.update('focus', {'_id': DB.getObjectId(id)}, json);


    if (prevPage) {
        ctx.redirect(prevPage);
    } else {
        //跳转
        ctx.redirect(ctx.state.__HOST__ + '/admin/focus');

    }

});
module.exports = router.routes();