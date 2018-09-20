<template>
  <div>
    <keep-alive>
      <component :is="current"></component>
    </keep-alive>
  </div>
</template>
<style lang="stylus" >
</style>
<script>
import Vue from 'vue'
// import Home from '../views/home/index'
import noPage from '@/views/error-page/404'
// import noPowerPage from '../pages/noPowerPage'
var pagePrex = 'page-'
var keyIndex = 0
export default {
  name: 'PageRouter',
  data: function () {
    return {
      current: '',
      componentCache: []
    }
  },
  watch: {
    $route (to, from) {
      // 对路由变化作出响应...
      console.log('对路由变化作出响应 ' + from.path + ' -> ' + to.path)
      // if (to.path !== from.path) {
      // 如果页面改变。load新页面加入
      this.loadPage(to.params, to.path === from.path || to.query.noCache)
      // }
    }
  },
  // components: { 'page-noPage': noPage, 'page-noPowerPage': noPowerPage },
  mounted: function () {
    this.loadPage(this.$route.params)
  },
  methods: {
    loadPage: function (data, noCache) {
      var path = this.getPath()
      let key = `${pagePrex}${path.replace('/', '-')}-${keyIndex}`
      if (this.componentCache[key] && !noCache) {
        console.log('from cache ' + key)
        this.current = this.componentCache[key]
      } else {
        console.log('from import ' + key)
        import('../views/' + path + '').then(module => {
          let tempModule = Vue.extend(module.default)
          tempModule = tempModule.extend({
            data: function () {
              return data.data || {}
            },
            methods: data.methods || {}
          })
          // keyIndex++
          Vue.component(key, tempModule)
          this.componentCache[key] = tempModule
          this.current = tempModule
        }).catch(() => {
          this.current = noPage
          console.error('不存在该页面', path)
        })
      }
    },
    getPath () {
      var params = this.$route.params
      var arr = []
      for (var k in params) {
        arr.push(params[k])
      }
      if (arr.length === 0) {
        arr.push('home')
        this.$router.push({path: '/home', params: {name: 'home'}})
      }
      return arr.join('/')
    }
  }
}
</script>
