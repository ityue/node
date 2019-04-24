const koa = require('koa')
const app = new koa()

const Router = require('koa-router')
const router = new Router()

const serve = require('koa-static')

const path = require('path')

const staticPath = path.resolve(__dirname, 'static')

// 设置静态服务
const staticServe = serve(staticPath, {
  setHeaders: (res, path, stats) => {
    if (path.indexOf('jpg') > -1) {
      res.setHeader('Cache-Control', ['private', 'max-age=60'])
    }
  }
});
app.use(staticServe);

router.get('/ajax', async (ctx, next) => {
  console.log('get request', ctx.request.header.referer)
  ctx.body = '{"frist":"任越第一个接口"}'
});

router.get('jsonp', async (ctx, next) => {
    const req = ctx.request.query
    console.log(req)
    const data = {
        data: req.type
    }
    ctx.body = req.callback + '('+JSON.stringify(data) + ')'
})
app.use(router.routes());

app.listen(3200);
console.log('koa server is listening port 3200');