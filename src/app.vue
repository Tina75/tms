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
import CHeader from '@/components/HeaderBar'
import CDialog from '@/components/Dialogs'
import { mapMutations, mapActions } from 'vuex'
import Cookies from 'js-cookie'
import CSider from './components/sider/Sider'
import CContent from './components/Content'
// import Util from './libs/js/util.js'

export default {
  components: { CHeader, CDialog, CSider, CContent },
  data () {
    return {
    }
  },

  mounted () {
    window.EMA.bind('updateUserInfo', () => { this.getUserInfo() })
    window.EMA.bind('logout', (msg) => { this.logout(msg) })
    this.init()
  },
  methods: {
    ...mapActions(['getPermissons', 'getUserInfo']),
    ...mapMutations(['setTabNavList', 'initTabNav']),
    async init () {
      this.$Message.config({
        duration: 3
      })
      await this.getPermissons()
      this.initTabNav()
      // this.toHome()
      await this.getUserInfo()
      if (sessionStorage.getItem('first_time_login') === 'true') {
        if (this.UserInfo.type === 1) this.renew()
        else this.changePasswordTip()
        sessionStorage.removeItem('first_time_login')
      }
    },

    /**
    * @description 打开首页
    */
    toHome () {
      // const home = { path: '/home', params: { name: 'home' }, query: { title: '首页' } }
      // window.EMA.fire('openTab', home)
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
    },

    renew () {
      window.EMA.fire('Dialogs.push', {
        name: 'dialogs/renew',
        data: {
          title: '温馨提示',
          expirationTime: this.UserInfo.expirationTime
        }
      })
    },

    changePasswordTip () {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>您的密码为初始密码，为确保账户安全，请及时修改密码</p>',
        okText: '立即修改',
        cancelText: '我知道了',
        onOk: () => {
          window.EMA.fire('openTab', { path: '/set-up/index', query: { title: '设置' } })
        }
      })
    },

    getNextRoute (list, route) {
      let res = {}
      const index = list.findIndex(item => this.routeEqual(item, route))
      if (index === list.length - 1) res = list[list.length - 2]
      else res = list[index + 1]
      return res
    },
    /**
     * @description 根据name/params/query判断两个路由对象是否相等
     * @param {*} route1 路由对象
     * @param {*} route2 路由对象
     */
    routeEqual (route1, route2) {
      const query1 = route1.query || {}
      const query2 = route2.query || {}
      // return (route1.name === route2.name) && this.objEqual(params1, params2) && this.objEqual(query1, query2)
      return (route1.path === route2.path) && (query1.title === query2.title)
      // return (route1.name === route2.name) && this.objEqual(meta1, meta2)
    },

    /**
   * @param {*} obj1 对象
     * @param {*} obj2 对象
     * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
     */
    objEqual (obj1, obj2) {
      const keysArr1 = Object.keys(obj1)
      const keysArr2 = Object.keys(obj2)
      if (keysArr1.length !== keysArr2.length) return false
      else if (keysArr1.length === 0 && keysArr2.length === 0) return true
      /* eslint-disable-next-line */
      else return !keysArr1.some(key => obj1[key] != obj2[key])
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
    .logo-con
      height 50px
      padding 10px
      img
        height 44px
        width auto
        display block
        margin 0 auto
    .header-con
      position relative
      z-index 9
      width 100%
      .tag-nav-wrapper
        width auto
        top 4px
        left 0
        right 185px
        position absolute
        padding 0
        height 46px
        z-index 9
        // background #F0F0F0
        overflow hidden
        .tags-nav .scroll-outer .scroll-body
          bottom -1px

.ivu-modal-footer
  border-top none
  text-align center
  .ivu-btn
    min-width 85px
.ivu-layout
  background #efefef
.sider-trigger-a
  position absolute
  top 45%
  left 200px
  width:0;
  height:55px;
  border-left:11px solid #C1C6CB;
  border-top:7px solid transparent;
  border-bottom:7px solid transparent;
  i
    display inline-block
    color #252A2F
    margin-left -13px
    margin-top 10px
    font-size 14px
    transform rotate(180deg)
.collapsed
  transform translateX(-150px)
  transition transform .2s ease
  i
    transform rotate(0deg)
    transition transform .2s ease
  // left 50px
.uncollapsed
  transition transform .2s ease
</style>
