const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const static = require('koa-static')

const app = new Koa()

app.use(static(path.join(__dirname, './cors')))

app.listen(8080, () => {
  console.log(' start at port 8080')
})
