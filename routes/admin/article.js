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
    let result = await DB.find('article', {}, {}, {
        page, pageSize
    });
    let count = await DB.count('article', {});

    await ctx.render('admin/article/index', {
        list: result,
        totalPages: Math.ceil(count / pageSize),
        page: page
    })
});

router.get('/add', async ctx => {
    let cateList = await DB.find('articlecate',{});
    await ctx.render('admin/article/add', {
        catelist: tools.cateToList(cateList)
    })
});
router.get('/ueditor', async ctx => {
    await ctx.render('admin/article/ueditor')
});

router.post('/doAdd', upload.single('img_url'), async ctx => {
    //img_url <img> 中的name
    // ctx.body = {
    //     //返回文件名
    //     filename: ctx.req.file ? ctx.req.file.filename : '',
    //     body: ctx.req.body
    // }

    let pid=ctx.req.body.pid;
    let catename=ctx.req.body.catename.trim();
    let title=ctx.req.body.title.trim();
    let author=ctx.req.body.author.trim();
    let pic=ctx.req.body.author;
    let status=ctx.req.body.status;
    let is_best=ctx.req.body.is_best;
    let is_hot=ctx.req.body.is_hot;
    let is_new=ctx.req.body.is_new;
    let keywords=ctx.req.body.keywords;
    let description=ctx.req.body.description || '';
    let content=ctx.req.body.content ||'';
    let img_url=ctx.req.file? ctx.req.file.path :'';

    //属性的简写
    let json={
        pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url
    };

    let result=DB.insert('article',json);

    //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/article');
});

router.get('/edit', async ctx => {
    let id = ctx.query.id;
    let catelist = await DB.find('articlecate', {});
    let articlelist = await DB.find('article', {_id: DB.getObjectId(id)});
    await ctx.render('admin/article/edit', {
        catelist:tools.cateToList(catelist),
        list:articlelist[0],
        prevPage :ctx.state.G.prevPage
    })
});

router.post('/doEdit',upload.single('img_url'), async ctx => {
    let prevPage=ctx.req.body.prevPage || '';  /*上一页的地址*/
    let id=ctx.req.body.id;
    let pid=ctx.req.body.pid;
    let catename=ctx.req.body.catename.trim();
    let title=ctx.req.body.title.trim();
    let author=ctx.req.body.author.trim();
    let pic=ctx.req.body.author;
    let status=ctx.req.body.status;
    let is_best=ctx.req.body.is_best;
    let is_hot=ctx.req.body.is_hot;
    let is_new=ctx.req.body.is_new;
    let keywords=ctx.req.body.keywords;
    let description=ctx.req.body.description || '';
    let content=ctx.req.body.content ||'';

    let img_url=ctx.req.file? ctx.req.file.path :'';

    //属性的简写
    //注意是否修改了图片          var           let块作用域
    let json = {};
    if(img_url){
        json={
            pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url
        }
    }else{
        json={
            pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content
        }
    }

    DB.update('article',{"_id":DB.getObjectId(id)},json);


    //跳转
    if(prevPage){
        ctx.redirect(prevPage);

    }else{
        ctx.redirect(ctx.state.__HOST__+'/admin/article');
    }
});

router.get('/delete', async ctx => {
    ctx.body = '删除用户'
});

module.exports = router.routes();