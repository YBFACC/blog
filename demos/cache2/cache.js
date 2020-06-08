const Koa = require('koa')
const Router = require('koa-router')
const fs = require('fs')
const log = require('koa-logger')
const crypto = require('crypto')
const app = new Koa()

app.use(log())

const page = new Router()

// //强缓存
// page.get('/png2', async ctx => {
//   ctx.res.setHeader('Cache-control', 'no-store')
//   // ctx.res.setHeader('Cache-control', 'public,max-age=86400')

//   ctx.type = 'image/png'
//   ctx.res.writeHead(200)
//   let img = fs.readFileSync('./cache/png2.png')
//   ctx.res.write(img, 'binary')
//   ctx.res.end()
// })

// last-modified
page.get('/png2', async ctx => {
  ctx.res.setHeader('Cache-control', 'no-cache')

  const ifModifiedSince = ctx.req.headers['if-modified-since']

  let stats = fs.statSync('./cache/png2.png')

  let change_time = stats.mtime.toUTCString()

  if (change_time === ifModifiedSince) {
    ctx.res.writeHead(304)
  } else {
    ctx.res.setHeader('last-modified', change_time)
    ctx.type = 'image/png'
    ctx.res.writeHead(200)
    let img = fs.readFileSync('./cache/png2.png')
    ctx.res.write(img, 'binary')
    ctx.res.end()
  }
})

//Etag 弱校验
page.get('/png1', async ctx => {
  ctx.res.setHeader('Cache-control', 'no-cache')

  const ifNoneMatch = ctx.req.headers['if-none-match']

  let stats = fs.statSync('./cache/png1.png')

  var mtime = stats.mtime.getTime().toString(16)
  var size = stats.size.toString(16)

  let change_time = 'W/' + `"${size}-${mtime}"`

  if (change_time === ifNoneMatch) {
    ctx.res.writeHead(304)
  } else {
    ctx.res.setHeader('etag', change_time)
    ctx.type = 'image/png'
    ctx.res.writeHead(200)
    let img = fs.readFileSync('./cache/png1.png')
    ctx.res.write(img, 'binary')
    ctx.res.end()
  }
})

//无
page.get('/index', ctx => {
  ctx.type = 'text/html'
  ctx.res.writeHead(200)
  let img = fs.readFileSync('./cache/index.html', 'utf-8')
  ctx.res.write(img, 'binary')
  ctx.res.end()
})
//etag强校验
page.get('/css', ctx => {
  ctx.res.setHeader('Cache-control', 'no-cache')

  const ifNoneMatch = ctx.req.headers['if-none-match']

  const hash = crypto.createHash('md5')

  let css = fs.readFileSync('./cache/test.css', 'utf-8')
  hash.update(css)
  const etag = `"${hash.digest('hex')}"`

  if (ifNoneMatch === etag) {
    ctx.res.writeHead(304)
  } else {
    ctx.res.setHeader('etag', etag)
    ctx.type = 'text/css'
    ctx.res.writeHead(200)
    ctx.res.write(css, 'binary')
    ctx.res.end()
  }
})

app.use(page.routes()).use(page.allowedMethods())
app.listen(3000)
