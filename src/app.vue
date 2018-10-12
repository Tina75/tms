<template>
  <div id="app">
    <Layout class="container">
      <Sider v-model="collapsed" :collapsed-width="50" hide-trigger collapsible style="overflow:hidden">
        <side-bar :collapsed="collapsed" :active-name="$route.path" :menu-list="menuList" @on-select="onMenuSelect"/>
      </Sider>
      <Layout>
        <Header class="header-con">
          <header-bar :collapsed.sync="collapsed" :name="UserInfo.name" @on-open-msg="onOpenMsg"/>
          <div class="tag-nav-wrapper">
            <tab-nav :list="TabNavList" :value="$route" @on-close="onTabClose" @on-select="onTabSelect"/>
          </div>
        </Header>
        <Content class="content">
          <router-view />
        </Content>
      </Layout>
    </Layout>
    <dialogs></dialogs>
  </div>
</template>
<script>
import HeaderBar from '@/components/HeaderBar'
import SideBar from '@/components/SideBar'
import TabNav from '@/components/TabNav'
import Dialogs from '@/components/Dialogs'
import menuJson from '@/assets/menu.json'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Cookies from 'js-cookie'

export default {
  components: { HeaderBar, SideBar, TabNav, Dialogs },
  data () {
    return {
      collapsed: false,
      menuList: menuJson
    }
  },
  computed: {
    ...mapGetters(['TabNavList', 'UserInfo'])
  },

  mounted () {
    console.log(process)

    window.EMA.bind('updateUserInfo', () => { this.getUserInfo() })
    window.EMA.bind('logout', (msg) => { this.logout(msg) })
    window.EMA.bind('openTab', (route) => { this.onMenuSelect(route) })
    window.EMA.bind('closeTab', (route) => { this.onTabClose(route) })
    window.EMA.bind('reloadTab', (route) => {
      route.query = Object.assign({ _time: new Date().getTime() }, route.query)
      this.turnToPage(route)
    })
    this.init()
  },
  methods: {
    ...mapActions(['getPermissons', 'getUserInfo', 'getMessageCount']),
    ...mapMutations(['setTabNavList', 'initTabNav']),
    async init () {
      await this.getPermissons()
      this.initTabNav()
      this.toHome()
      await this.getUserInfo()
      this.loopMessage()
      if (sessionStorage.getItem('first_time_login') === 'true') {
        if (this.UserInfo.type === 1) this.renew()
        else this.changePasswordTip()
        sessionStorage.removeItem('first_time_login')
      }
    },
    loopMessage () {
      setInterval(() => {
        this.getMessageCount()
      }, 60 * 1000)
    },
    /**
    * @description 打开消息tab
    * @param type 消息类型
    */
    onOpenMsg (type) {
      const route = { path: '/information/index', query: { type: type, title: '消息' } }
      window.EMA.fire('openTab', route)
    },
    /**
    * @description 打开首页
    */
    toHome () {
      const home = { path: '/home', params: { name: 'home' }, query: { title: '首页' } }
      this.turnToPage(home)
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
          title: '提示',
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
    /**
     * @description 关闭tab标签时调用
     * @param {*} list 关闭后的tab页list
     * @param {*} route 关闭的tab对象，用于查找前一个tab并置为高亮
    */
    onTabClose (route) {
      // 删除cache
      window.EMA.fire('PageRouter.remove', route.path)

      console.log(route, this.$route)
      if (this.routeEqual(route, this.$route)) {
        // 选中前一个tab
        const nextRoute = this.getNextRoute(this.TabNavList, route)
        this.turnToPage(nextRoute)
      }

      // 更新store
      let res = this.TabNavList.filter(element => element.query.title !== route.query.title)
      this.setTabNavList(res)
    },

    /**
     * @description 切换tab标签
     * @param {*} item 被选中的菜单对象
     */
    onTabSelect (item) {
      this.turnToPage(item)
    },

    /**
     * @description 切换菜单
     * @param {*} menuItem 被选中的菜单对象
     */
    onMenuSelect (menuItem) {
      console.log('1.', JSON.stringify(menuItem))

      this.setTabNavList(this.getNewTagList(this.TabNavList, menuItem))
      this.turnToPage(menuItem)
    },

    /**
     * @description 切换tab标签
     * @param {*} route 跳转目标的path或route对象
     */
    turnToPage (route) {
      let { path, params, query, meta } = {}
      if (typeof route === 'string') path = route
      else {
        path = route.path
        params = route.params
        query = route.query
        meta = route.meta
      }
      this.$router.push({ path, params, query, meta })
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
    },

    /**
     * @param {*} list 现有标签导航列表
     * @param {*} newRoute 新添加的路由原信息对象
     * @description 如果该newRoute已经存在则不再添加
     */
    getNewTagList  (list, newRoute) {
      const { name, path, query, meta } = newRoute
      let newList = [...list]
      // if (newList.findIndex(item => item.path === path) >= 0) {
      if (newList.findIndex(item => this.routeEqual(item, newRoute)) >= 0) {
        return newList
      } else {
        // find当前tab位置并在其后面添加新tab
        const idx = newList.findIndex(item => item.path === this.$route.path)
        // const idx = newList.findIndex(item => this.routeEqual(item, this.$route))
        newList.splice(idx + 1, 0, { name, path, query, meta })
      }
      return newList
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
  .container
    height 100vh
    background #EFEFEF
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
      .tag-nav-wrapper
        width auto
        top 4px
        left 30px
        right 185px
        position absolute
        padding 0
        height 46px
        z-index 9
        // background #F0F0F0
        overflow hidden
        .tags-nav .scroll-outer .scroll-body
          bottom -1px
    .content
      padding 15px 20px
      height 100%
      overflow-y auto

.ivu-modal-footer
  border-top none
  text-align center
  .ivu-btn
    min-width 85px
.ivu-layout
  background #efefef
</style>
