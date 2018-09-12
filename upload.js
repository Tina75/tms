'use strict'
console.warn('------------------------------------------------发布项目到FTP服务器------------------------------------------------')

// 依赖引用
var program = require('commander')
var path = require('path')
var fs = require('fs')
var EasyFtp = require('easy-ftp')

// ftp配置文件
var ftpConfig = {
  dev: {
    server: {
      host: '192.168.1.39',
      username: 'root',
      password: 'ymm12345',
      port: 22,
      type: 'sftp'
    },
    path: '/data/jikang/devstatic/tms'
  },
  beta: {
    server: {
      host: '192.168.1.39',
      username: 'root',
      password: 'ymm12345',
      port: 22,
      type: 'sftp'
    },
    path: '/data/jikang/qastatic/tms'
  }
}

// 输入参数解析
program
  .version('0.0.1')// 版本号
program
  .option('-e, --environment [value]', '打包环境 dev、beta、release')
program.parse(process.argv)

// 参数判断
var env = program.environment
if (!env) {
  throw new Error('缺少参数 -e, --environment ,打包环境 dev、beta、release')
}
if (['dev', 'beta', 'release'].indexOf(env) < 0) {
  throw new Error('参数错误 -e, --environment ,打包环境 dev、beta、release')
}
if (!ftpConfig[env]) {
  throw new Error('打包环境：' + env + ' ，还未启用')
}

var projectPath = './dist'
// 检测是否存在项目文件夹
fs.exists(path.resolve(projectPath), function (isExists) { // eslint-disable-line
  if (!isExists) {
    throw new Error('请先将项目发布到dist文件夹下')
  }
})

var fc = ftpConfig[env]
var ftp = new EasyFtp()
ftp.connect(fc.server)

console.log('开始上传到远程文件夹:', fc.server.host, fc.path)
ftp.upload(projectPath + '/*', fc.path, function (err) {
  ftp.close()
  if (err) {
    throw err
  }
  console.log('上传所有文件成功')
})

ftp.on('upload', function (path) {
  console.log('上传文件' + path)
})
ftp.on('error', function (path) {
  console.error(path)
})
