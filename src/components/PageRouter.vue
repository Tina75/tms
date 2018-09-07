<template>
  <div>
    <component :is="current"></component>
  </div>
</template>
<style lang="stylus" >
</style>
<script>
import Vue from 'vue'
// import Home from '../views/home'
// import noPage from '../pages/noPage'
// import noPowerPage from '../pages/noPowerPage'
var pagePrex = 'page-'
var keyIndex = 0
export default {
  name: 'PageRouter',
  data: function () {
    return {
      current: ''
    }
  },
  watch: {
    $route (to, from) {
      // 对路由变化作出响应...
      // console.log(to, from);
      if (to.path !== from.path) {
        // 如果页面改变。load新页面加入
        this.loadPage(to.params)
      }
    }
  },
  // components: { 'page-noPage': noPage, 'page-noPowerPage': noPowerPage },
  mounted: function () {
    this.loadPage(this.$route.params)
  },
  methods: {
    loadPage: function (data) {
      var path = this.getPath()

      import('../views/' + path + '')
        .then(module => {
          // eslint-disable-next-line
          var tempModule = Vue.extend(module.default);
          tempModule = tempModule.extend({
            data: function () {
              return data.data || {}
            },
            methods: data.methods || {}
          })
          keyIndex++
          Vue.component(`${pagePrex}${path.replace('/', '-')}-${keyIndex}`, tempModule)
          this.current = tempModule
        })
        .catch(() => {
          // console.error("不存在该页面", path);
        })
    },
    getPath () {
      var params = this.$route.params
      var arr = []
      for (var k in params) {
        arr.push(params[k])
      }
      if (arr.length === 0) arr.push(localStorage.getItem('tms_is_login') ? 'home' : 'login')
      return arr.join('/')
    }
  }
  // eslint-disable-next-line
  }
</script>
