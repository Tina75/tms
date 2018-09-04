# IVIEW-TEMPLATE
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Vue Style Guide](https://img.shields.io/badge/vue_style-beta-brightgreen.svg)](https://vuefe.cn/v2/style-guide/)
[![vue](https://img.shields.io/badge/vue-2.5.16-brightgreen.svg?style=flat-square)](https://github.com/vuejs/vue)
[![iview ui](https://img.shields.io/badge/iview-3.0.0-brightgreen.svg?style=flat-square)](https://github.com/iview/iview)
[![vue-cli3.0](https://img.shields.io/badge/vue_cli-3.0-brightgreen.svg?style=flat-square)](https://cli.vuejs.org)

## 使用前必读
`屏幕适配 >= 1366px`
1. 技术栈[Vue](http://cn.vuejs.org/guide/) + [Vue-router](http://router.vuejs.org/zh-cn/index.html) + [Vuex](http://vuex.vuejs.org/zh-cn/index.html), [Axios](https://github.com/mzabriskie/axios)作为http请求库
2. 集成打包脚手架使用[vue-cli3.0](https://cli.vuejs.org)
3. 使用[iview](https://www.iviewui.com)作为主体UI组件
4. Vue代码风格参考[style-guide](https://vuefe.cn/v2/style-guide/),JS参考[JavaScript Standard Style](https://standardjs.com/rules-zhcn.html)
5. 使用[stylus](https://www.zhangxinxu.com/jq/stylus/)作为预编译CSS框架,推荐[BEM](https://www.w3cplus.com/css/bem-definitions.html)作为CSS书写规范
6. 推荐使用VSCODE作为开发IDE，yarn安装包依赖
7. Git规范参考[GitFlow](https://www.cnblogs.com/lcngu/p/5770288.html)和[Commit message](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

## 准备
```
安装Node.js > 8
安装yarn
全局安装vue-cli3.0 (mac 需要 sudo)
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

### 推荐工具

- [VSCODE](https://code.visualstudio.com/)

#### VSCODE插件

- [Vetur - Vue tooling for VS Code](https://vuejs.github.io/vetur/)

- [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

### JS风格指南

- [JavaScript Standard Style](https://standardjs.com/rules-zhcn.html)

### Vue风格指南

- [style-guide](https://youzan.github.io/vant/#/zh-CN/style-guide)

- [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue/tree/master/docs/rules)

## 功能

### 配置优化

### 插件集成

- 图片懒加载[Vue-lazyload](https://github.com/hilongjw/vue-lazyload)

- Meta Title设置[Vue-Meta](https://github.com/declandewet/vue-meta)

- Vuex数据离线化[vuex-persistedstate](https://www.npmjs.com/package/vuex-persistedstate)

## Main Javascript Framework

-	[Vue](http://cn.vuejs.org/guide/)

-	[Vue-router](http://router.vuejs.org/zh-cn/index.html)

-	[Vuex](http://vuex.vuejs.org/zh-cn/index.html)

-	[Axios - Http Client](https://github.com/mzabriskie/axios)

-	[Vuex-Router-Sync - Keep vue-router and vuex store in sync](https://github.com/vuejs/vuex-router-sync)

## UI Compoents

-	[iView - Vue UI Components](https://www.iviewui.com)

## Plugins

-	[Vue-lazyload - An Image lazyload plugin for Vue](https://github.com/hilongjw/vue-lazyload)

## File Structure Introduction

```
├── public      # Dist Folder
├── app.vue     # Entry File
├── public
  ├── index.html  # Html Template
├── src           # Code Folder
  ├── assets      # 资源
  ├── components  # 组件
  ├── pages    # 功能模块
    ├── error-pages     # 错误模块
    ├── login           # 登录模块
      ├── modules       # vuex
      ├── pages         # view
      ├── router.js     # 子路由
  ├── router      # 主路由
  ├── store.js    # Vuex Main Stroe
  ├── main.js     # Entry Js
```

### 开始

## Install
```
npm/yarn install
npm/yarn run serve
open http://localhost:8088
```

### Build
```
npm/yarn run build
npm/yarn run build --report 查看打包JS大小
open Files in DistT Folder
```
