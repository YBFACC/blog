const Koa = require('koa')
const Router = require('koa-router')
const fs = require('fs')
const log = require('koa-logger')
const app = new Koa()

app.use(log())

const page = new Router()

page.get('/png', ctx => {
  // let exp = new Date()
  // exp.setTime(exp.getTime() + 60000)
  // console.log(exp.toUTCString())
  // ctx.res.setHeader('Expires', exp.toUTCString())
  ctx.res.setHeader('Cache-control', 'public,max-age=86400')
  ctx.type = 'image/png'
  ctx.res.writeHead(200)
  let img = fs.readFileSync('./cache/png.png')
  ctx.res.write(img, 'binary')
  ctx.res.end()
})

page.get('/index', ctx => {
  ctx.type = 'text/html'
  ctx.res.writeHead(200)
  let img = fs.readFileSync('./cache/index.html', 'utf-8')
  ctx.res.write(img, 'binary')
  ctx.res.end()
})

page.get('/css', ctx => {
  ctx.res.setHeader('Cache-control', 'public,max-age=86400')
  ctx.type = 'text/css'
  ctx.res.writeHead(200)
  let img = fs.readFileSync('./cache/test.css', 'utf-8')
  ctx.res.write(img, 'binary')
  ctx.res.end()
})

app.use(page.routes()).use(page.allowedMethods())

app.listen(3000)

