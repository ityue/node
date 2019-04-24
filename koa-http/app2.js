const koa = require('koa');
const app = new koa();
const Router = require('koa-router');

const cors = require('koa2-cors');
const router = new Router();

const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

router.get('/ajax', async (ctx, next) => {
  console.log('get request', ctx.request.header.referer)
  ctx.body = 'received'
});
// app.use(router.routes());

router.get('/jsonp', async (ctx, next) => {
    const req = ctx.request.query
    console.log(req)
    const data = {
        data: req.type
    }
    ctx.body = req.callback + '('+JSON.stringify(data) + ')';
});

router.post('/cors/test1', async (ctx, next) => {
    // console.log('ctx'+JSON.stringify(ctx)+ctx.request.header.origin)
    // 允许来自所有域名请求
    // ctx.set("Access-Control-Allow-Origin", "*");
    // 这样就能只允许 http://localhost:8080 这个域名的请求了
    ctx.set("Access-Control-Allow-Origin", ctx.request.header.origin);
    
    // 设置所允许的HTTP请求方法
    ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    
    // 字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段.
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
    
    // 服务器收到请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。
    
    // Content-Type表示具体请求中的媒体类型信息
    ctx.set("Content-Type", "application/json;charset=utf-8");
    
    // 该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。
    // 当设置成允许请求携带cookie时，需要保证"Access-Control-Allow-Origin"是服务器有的域名，而不能是"*";
    ctx.set("Access-Control-Allow-Credentials", true);
    
    // 该字段可选，用来指定本次预检请求的有效期，单位为秒。
    // 当请求方法是PUT或DELETE等特殊方法或者Content-Type字段的类型是application/json时，服务器会提前发送一次请求进行验证
    // 下面的的设置只本次验证的有效时间，即在该时间段内服务端可以不用进行验证
    ctx.set("Access-Control-Max-Age", 300);
    
    /*
    CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：
        Cache-Control、
        Content-Language、
        Content-Type、
        Expires、
        Last-Modified、
        Pragma。
    */
    // 需要获取其他字段时，使用Access-Control-Expose-Headers，
    // getResponseHeader('myData')可以返回我们所需的值
    // ctx.set("Access-Control-Expose-Headers", "myData");
    ctx.body = '{"frist":"任越第一个接口"}'
    await next();
})

app.use(cors({
    origin: function (ctx) {
        console.log('request==='+JSON.stringify(ctx.request.header))
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return ctx.request.header.origin
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
router.post('/cors/test2', async function (ctx) {
    ctx.body = '{"second":"任越第二个接口"}'
});

app.use(cors({
    origin: function (ctx) {
        console.log('request==='+JSON.stringify(ctx.request.body))
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return ctx.request.header.origin
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
router.post('/cors/test3', async function (ctx) {
    ctx.body = '{"thrid":"任越第三个接口"}'
});



app.use(router.routes())

app.listen(3201);
console.log('app2 server is listening port 3201');