<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      // 是否退出，防止接口不停提示登录无效等
      isLogout: false
    }
  },
  mounted () {
    window.EMA.bind('logout', this.logout)
  },
  methods: {
    /**
     * 用户退出
     * 1. 接口发现token失效，可能有其他用户登录，会包含msg
     * 2. 用户主动点击退出
     */
    logout (msg) {
      if (this.isLogout) {
        return
      }
      this.isLogout = true
      if (typeof msg === 'string') {
        this.$Message.warning({
          content: msg,
          duration: 3
        })
      }
      this.$store.dispatch('logout')
      this.$router.replace({ path: '/login' })
    }
  }
}
</script>

<style lang="stylus">

</style>
