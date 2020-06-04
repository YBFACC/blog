const Koa = require('koa')
const path = require('path')
const fs = require('fs')
const https = require('https')
const Router = require('koa-router')
const static = require('koa-static')

const app = new Koa()
const page = new Router()

page.get('/api', ctx => {
  // ctx.cookies.set('ybf', 'ybf', {
  //   maxAge: 86400000,
  //   domain: 'ybf.com',
  //   httpOnly: false
  // })
  console.log(ctx.cookies.get('ybf'))

  ctx.body = 'cookie is ok'
})

app.use(page.routes()).use(page.allowedMethods())

app.use(static(path.join(__dirname, './')))

app.listen(3000)

// 请准备准备自己对证书来开启https
// const options = {
//   key: fs.readFileSync('', 'utf8'),
//   cert: fs.readFileSync('', 'utf8')
// }

// https.createServer(options, app.callback()).listen(3000)
