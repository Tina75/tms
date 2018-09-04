<template>
  <div id="app">
    <Layout class="container">
      <Sider v-model="collapsed" :collapsed-width="64" hide-trigger collapsible >
        <sideBar/>
      </Sider>
      <Layout>
        <Header class="header-con">
          <header-bar :collapsed.sync="collapsed" :name="name" @on-coll-change="handleCollapsedChange"/>
        </Header>
        <Content>
          <Layout>
            <div class="tag-nav-wrapper">
              <tabs :list="tabList" @on-close="handleCloseTag" @input="handleClick"/>
            </div>
            <Content>
              <keep-alive>
                <router-view/>
              </keep-alive>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import headerBar from '@/components/header'
import sideBar from '@/components/side-bar'
import tabs from '@/components/tabs'
export default {
  components: {headerBar, sideBar, tabs},
  data () {
    return {
      collapsed: false,
      name: 'test',
      tabList: [
        {path: '/home', name: '首页'},
        {path: '/example/page1', name: 'page1'},
        {path: '/error-page/403', name: '403'},
        {path: '/error-page/404', name: '404'},
        {path: '/error-page/500', name: '500'}]
    }
  },
  methods: {
    handleCollapsedChange (state) {
      this.collapsed = state
    },
    handleCloseTag () {},
    handleClick (item) {
      this.turnToPage(item)
    },
    turnToPage (route) {
      let { path, params, query } = {}
      if (typeof route === 'string') path = route
      else {
        path = route.path
        params = route.params
        query = route.query
      }
      console.log(route.path)
      if (path.indexOf('isTurnByHref_') > -1) {
        window.open(path.split('_')[1])
        return
      }
      this.$router.push({
        path,
        params,
        query
      })
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
      background #fff
    .tag-nav-wrapper
      padding 0
      height 40px
      background #F0F0F0
      overflow hidden
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover
  background #00A4BD
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu)
  color white
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover
  background #00A4BD!important
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened
  background none
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title
  background #00C1DE
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title
  color rgba(255,255,255,1)
  font-family:PingFangSC-Regular;
  font-weight:400;
</style>
