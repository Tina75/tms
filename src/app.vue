<template>
  <div id="app">
    <Layout class="container">
      <Sider v-model="collapsed" :collapsed-width="56" hide-trigger collapsible >
        <side-bar :collapsed="collapsed" :active-name="$route.path" :menu-list="menuList" @on-select="onMenuSelect"/>
      </Sider>
      <Layout>
        <Header class="header-con">
          <header-bar :collapsed.sync="collapsed" :name="UserInfo.name" @on-msg-click="openMsgTab"/>
          <div class="tag-nav-wrapper">
            <tab-nav :list="TabNavList" :value="$route" @on-close="handleCloseTab" @on-select="onTabSelect"/>
          </div>
        </Header>
        <Content >
          <Layout>
            <Content class="content">
              <keep-alive>
                <router-view />
              </keep-alive>
            </Content>
          </Layout>
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

export default {
  components: { HeaderBar, SideBar, TabNav, Dialogs },
  data () {
    return {
      collapsed: false,
      menuList: menuJson,
      defaultTab: { name: '首页', path: '/home' }
    }
  },
  computed: {
    ...mapGetters(['TabNavList', 'UserInfo'])
  },

  mounted () {
    window.EMA.bind('logout', (msg) => {
      if (msg) {
        this.$Modal.warning({
          title: '提示',
          content: `${msg}，请重新登录`,
          onOk: () => { this.logout() }
        })
      } else {
        this.logout()
      }
    })
    window.EMA.bind('refresh', (route) => {
      if (!route.query) route.query = {}
      route.query._time = new Date().getTime()
      this.turnToPage(route)
    })
    window.EMA.bind('updateUserInfo', () => {
      this.getUserInfo()
    })
    window.EMA.bind('openTab', (route) => {
      let tag = { ...route }
      if (route.query) {
        tag.name = route.query.id ? route.query.id : route.name
        this.setTabNavList(this.getNewTagList(this.TabNavList, tag))
        this.turnToPage(tag)
      }
    })
    this.init()
    // this.$nextTick(() => {
    //   this.turnToPage(this.defaultTab)
    // })
    // 初始化tabnav
    // if (this.$route.path === '/') {
    //   setTimeout(() => {
    //     this.onMenuSelect({ name: '首页', path: '/home' })
    //   }, 200)
    // }
  },
  methods: {
    ...mapActions(['getPermissons', 'getUserInfo', 'getMessageCount']),
    ...mapMutations(['setTabNavList', 'initTabNav']),
    async init () {
      await this.getPermissons()
      this.initTabNav()
      this.toHome()
      this.getUserInfo()
      this.getMessageCount()
      // 获取用户权限
      // TODO: something
    },
    toHome () {
      const home = {path: '/home', params: {name: 'home'}}
      this.turnToPage(home)
    },
    openMsgTab (type = 0) {
      const router = {path: '/info/info', name: '消息', query: {type: type}}
      this.onMenuSelect(router)
    },
    logout () {
      localStorage.clear()
      window.location.reload()
    },
    handleCloseTab (list, route) {
      // 选中前一个tab
      const nextRoute = this.getNextRoute(this.TabNavList, route)
      this.turnToPage(nextRoute)
      this.setTabNavList(list) // 更新store
    },
    onTabSelect (item) {
      this.turnToPage(item)
    },
    onMenuSelect (menuItem) {
      this.setTabNavList(this.getNewTagList(this.TabNavList, menuItem))
      this.turnToPage(menuItem)
    },
    turnToPage (route) {
      let { path, params, query } = {}
      if (typeof route === 'string') path = route
      else {
        path = route.path
        params = route.params
        query = route.query
      }
      this.$router.push({ path, params, query })
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
      // const params1 = route1.params || {}
      // const params2 = route2.params || {}
      const query1 = route1.query || {}
      const query2 = route2.query || {}
      // return (route1.name === route2.name) && this.objEqual(params1, params2) && this.objEqual(query1, query2)
      return (route1.name === route2.name) && (query1.id === query2.id)
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
      const { name, path, query } = newRoute
      let newList = [...list]
      // if (newList.findIndex(item => item.path === path) >= 0) {
      if (newList.findIndex(item => this.routeEqual(item, newRoute)) >= 0) {
        return newList
      } else {
        // find当前tab位置并在其后面添加新tab
        const idx = newList.findIndex(item => item.path === this.$route.path)
        // const idx = newList.findIndex(item => this.routeEqual(item, this.$route))
        newList.splice(idx + 1, 0, { name, path, query })
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
      .tag-nav-wrapper
        width auto
        top 4px
        left 30px
        right 185px
        position absolute
        padding 0
        height 46px
        // background #F0F0F0
        overflow hidden
    .content
      margin 15px
      padding 15px
      background white
      min-height 88vh

.ivu-modal-footer
  border-top none
  text-align center
  .ivu-btn
    min-width 85px
.ivu-layout
  background #efefef
</style>
