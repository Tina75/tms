<template>
  <div id="app">
    <Layout class="container">
      <c-sider></c-sider>
      <Layout >
        <c-header/>
        <c-content/>
      </Layout>
    </Layout>
    <c-dialog></c-dialog>
  </div>
</template>
<script>
import CSider from './components/side-bar/SideBar'
import CHeader from './components/HeaderBar'
import CContent from './components/Content'
import CDialog from './components/Dialogs'
import { mapMutations, mapActions } from 'vuex'
import Cookies from 'js-cookie'

export default {
  components: { CHeader, CDialog, CSider, CContent },
  mounted () {
    window.EMA.bind('logout', (msg) => { this.logout(msg) })
    this.init()
  },
  methods: {
    ...mapActions(['getPermissons', 'getUserInfo', 'getMessageCount', 'getTableColumns']),
    ...mapMutations(['setTabNavList', 'initTabNav']),
    async init () {
      this.$Message.config({
        duration: 3
      })
      await this.getPermissons()
      this.initTabNav()
      await this.getUserInfo()
    },

    /**
    * @description 登出，清空localStorage中的tab页记录，删除本地token，刷新页面
    * @param msg 提示语
    */
    logout (msg) {
      if (msg) {
        this.$Modal.warning({
          title: '提示',
          content: msg,
          onOk: () => {
            clearLocalData()
          }
        })
      } else {
        clearLocalData()
      }
      function clearLocalData () {
        const localRememberdPW = window.localStorage.local_rememberd_pw
        localStorage.clear()
        if (localRememberdPW) window.localStorage.setItem('local_rememberd_pw', localRememberdPW)
        Cookies.remove('token', { path: '/tms' })
        window.location.reload()
      }
    }
  }
}
</script>

<style lang="stylus">
@import "./libs/css/helper"
html, body
  width 100%
  height 100%
  background #f0f0f0
  overflow hidden
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  // text-align center
  color #2c3e50
  width 100%
  height 100%
  .ivu-layout-sider-children .ivu-menu-dark .ivu-menu-item
    max-height 49px
  .container
    height 100vh
    background #EFEFEF
    flex-direction row

</style>
