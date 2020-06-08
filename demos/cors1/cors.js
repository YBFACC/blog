const Koa = require('koa')
const log = require('koa-logger')
const Router = require('koa-router')
const app = new Koa()

app.use(log())
const page = new Router()

app.use((ctx, next) => {
  // console.log(new Date())

  // ctx.res.setHeader('Access-Control-Allow-Origin', 'http://ybf.com:8080')
  // ctx.res.setHeader('Access-Control-Expose-Headers', 'X-Custom-Header')
  // ctx.res.setHeader('`Access-Control-Allow-Credentials', 'true')

  // ctx.res.setHeader('Access-Control-Allow-Methods', 'PUT')
  // ctx.res.setHeader('Access-Control-Request-Headers', 'X-Custom-Header')
  // ctx.res.setHeader('Access-Control-Allow-Headers', 'X-Custom-Header')

  next()
})

page.get('/api', ctx => {
  // ctx.res.setHeader('X-Custom-Header', 'TestCors')

  // console.log(ctx.req.headers['x-custom-header'])

  ctx.body = 'cookie is ok'
})

app.use(page.routes()).use(page.allowedMethods())

app.listen(3000, () => {
  console.log(' start at port 3000')
})
