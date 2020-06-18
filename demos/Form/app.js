const Koa = require('koa')
const path = require('path')
const Router = require('koa-router')
const static = require('koa-static')
const querystring = require('querystring')
const fs = require('fs')

const app = new Koa()
const page = new Router()

page.get('/get', ctx => {
  console.log(ctx.req.url)
  ctx.body = 'ok'
})

page.post('/post', async ctx => {
  let str = await getFrom(ctx)
  ctx.body = `<div>${str}</div>`

  // await parseFile(ctx.req, ctx.res)
  // ctx.body = 'ybf'
})

app.use(page.routes()).use(page.allowedMethods())

app.use(static(path.join(__dirname, './form')))

app.listen(3000)

function getFrom(ctx) {
  let body = []
  ctx.req.on('data', chunk => {
    body.push(chunk)
  })
  return new Promise((res, rej) => {
    ctx.req.on('end', chunk => {
      res(Buffer.concat(body).toString())
    })
  })
}

function parseFile(req, res) {
  req.setEncoding('binary')

  var body = '' // 文件数据
  var fileName = '' // 文件名
  // 边界字符串
  var boundary = req.headers['content-type']
    .split('; ')[1]
    .replace('boundary=', '')
  req.on('data', function (chunk) {
    body += chunk
  })

  req.on('end', function () {
    var file = querystring.parse(body, '\r\n', ':')
    console.log(file['Content-Disposition'])

    // 只处理图片文件
    if (file['Content-Type'].indexOf('image') !== -1) {
      //获取文件名
      var fileInfo = file['Content-Disposition'].split('; ')
      for (value in fileInfo) {
        if (fileInfo[value].indexOf('filename=') != -1) {
          fileName = fileInfo[value].substring(10, fileInfo[value].length - 1)

          if (fileName.indexOf('\\') != -1) {
            fileName = fileName.substring(fileName.lastIndexOf('\\') + 1)
          }
          console.log('文件名: ' + fileName)
        }
      }

      // 获取图片类型(如：image/gif 或 image/png))
      var entireData = body.toString()
      var contentTypeRegex = /Content-Type: image\/.*/

      contentType = file['Content-Type'].substring(1)

      //获取文件二进制数据开始位置，即contentType的结尾
      var upperBoundary = entireData.indexOf(contentType) + contentType.length
      var shorterData = entireData.substring(upperBoundary)

      // 替换开始位置的空格
      var binaryDataAlmost = shorterData
        .replace(/^\s\s*/, '')
        .replace(/\s\s*$/, '')

      // 去除数据末尾的额外数据，即: "--"+ boundary + "--"
      var binaryData = binaryDataAlmost.substring(
        0,
        binaryDataAlmost.indexOf('--' + boundary + '--')
      )

      // 保存文件
      fs.writeFile(fileName, binaryData, 'binary', function (err) {
        console.log(err)
      })
    } else {
      res.end('只能上传图片文件')
    }
  })
}
