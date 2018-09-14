<template>
  <div id="app">
    <Layout class="container">
      <Sider v-model="collapsed" :collapsed-width="56" hide-trigger collapsible >
        <side-bar :collapsed="collapsed" :active-name="$route.path" :menu-list="menuList" @on-select="onMenuSelect"/>
      </Sider>
      <Layout>
        <Header class="header-con">
          <header-bar :collapsed.sync="collapsed" :name="name" @on-coll-change="handleCollapsedChange"/>
          <div class="tag-nav-wrapper">
            <tab-nav :list="tabNavList" :value="$route" @on-close="handleCloseTab" @on-select="onTabSelect"/>
          </div>
        </Header>
        <Content >
          <Layout>
            <Content class="content">
              <keep-alive>
                <router-view/>
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
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: { HeaderBar, SideBar, TabNav, Dialogs },
  data () {
    return {
      collapsed: false,
      name: '端木和天',
      menuList: menuJson
    }
  },
  computed: {
    ...mapGetters(['tabNavList']),
    ...mapMutations(['setTabNavList'])
  },

  mounted () {
    window.EMA.bind('logout', () => {
      this.logout()
    })
    window.EMA.bind('refresh', () => {
      window.location.reload()
    })
    window.EMA.bind('openTab1', (route) => {
      console.log('open')
      let tag = {...route}
      tag.name = route.query.id ? route.query.id : route.name
      // this.setTabNavList(this.getNewTagList(this.tabNavList, tag))
      this.$store.commit('setTabNavList', this.getNewTagList(this.tabNavList, tag))
      this.turnToPage(tag)
      // this.$router.push(route)
    })
  },
  methods: {
    logout () {
      localStorage.removeItem('tms_is_login')
      window.location.reload()
    },
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTab (list, route) {
      // 选中前一个tab
      const nextRoute = this.getNextRoute(this.tabNavList, route)
      this.$router.push(nextRoute)
      this.$store.commit('setTabNavList', list)
      // this.setTabNavList(list) // 更新store
    },
    onTabSelect (item) {
      this.turnToPage(item)
    },
    onMenuSelect (menuItem) {
      console.log('onMenuSelect', menuItem)
      this.turnToPage(menuItem)
      this.$store.commit('setTabNavList', this.getNewTagList(this.tabNavList, menuItem))
      // this.setTabNavList(this.getNewTagList(this.tabNavList, menuItem))
    },
    turnToPage (route) {
      let { path, params, query } = {}
      if (typeof route === 'string') path = route
      else {
        path = route.path
        params = route.params
        query = route.query
      }
      // if (path.indexOf('isTurnByHref_') > -1) {
      //   window.open(path.split('_')[1])
      //   return
      // }
      // this.$store.commit('changeTag')
      this.$router.push({
        path,
        params,
        query
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
      const params1 = route1.params || {}
      const params2 = route2.params || {}
      const query1 = route1.query || {}
      const query2 = route2.query || {}
      return (route1.name === route2.name) && this.objEqual(params1, params2) && this.objEqual(query1, query2)
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
      console.log('list')
      const { name, path, meta, query } = newRoute
      let newList = [...list]
      if (newList.findIndex(item => item.path === path) >= 0) return newList
      else newList.push({ name, path, meta, query })
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
    .ivu-layout-sider
      background-color #252A2F
      .ivu-menu-dark
        background-color #252A2F
    .ivu-layout-header
      height 50px
      line-height 50px
      padding 0
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
        .ivu-tag-dot
          border-bottom none!important
          border-radius 8px 8px 0 0
          background #3A424B!important
          border none !important
          .ivu-tag-text
            color #fff
    .content
      margin 15px
      padding 15px
      background white
      min-height 88vh
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover
  background #00A4BD
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu)
  color white
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover
  background #00A4BD!important
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened
  background none

.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title
  color rgba(255,255,255,1)
  font-family:PingFangSC-Regular;
  font-weight:400;
.ivu-modal-footer
  border-top none
  text-align center
  .ivu-btn
    min-width 85px
.ivu-layout
  background #efefef
</style>
