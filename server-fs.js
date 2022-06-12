const http = require('http')
const fs = require('fs')



// 初阶: 继续完善静态服务器，使其基于 stream，并能给出正确的 Content-Length
// 高阶: 继续完善静态服务器，使其作为一个命令行工具，支持指定端口号、读取目录、404、stream (甚至 trailingSlash、cleanUrls、rewrite、redirect 等)。可参考 serve-handler (opens new window)。
// 面试: 什么是 rewrite 和 redirect



const server= http.createServer(async(req,res)=>{
  const stat = await fs.promises.stat('./index.html')
  res.setHeader('content-length',stat.size)
  fs.createReadStream('./index.html').pipe(res)
})


 server.listen(3000,()=>{
    console.log('Listening 3000')
 })