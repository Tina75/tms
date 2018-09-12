<template>
  <div id="app">
    <Layout class="container">
      <Sider v-model="collapsed" :collapsed-width="56" hide-trigger collapsible >
        <side-bar :collapsed="collapsed" @on-select="turnToPage"/>
      </Sider>
      <Layout>
        <Header class="header-con">
          <header-bar :collapsed.sync="collapsed" :name="name" @on-coll-change="handleCollapsedChange"/>
          <div class="tag-nav-wrapper">
            <tab-nav :list="tabList" :value="currTab" @on-close="handleCloseTag" @input="handleClick"/>
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
import { mapGetters } from 'vuex'

export default {
  components: { HeaderBar, SideBar, TabNav, Dialogs },
  data () {
    return {
      collapsed: false,
      name: '端木和地'
    }
  },
  computed: {
    ...mapGetters({
      tabList: 'getTabList',
      currTab: 'currTab'
    })
  },
  mounted () {
    window.EMA.bind('logout', () => {
      this.logout()
    })
    window.EMA.bind('refresh', () => {
      window.location.reload()
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
    handleCloseTag () {},
    handleClick (item) {
      this.turnToPage(item)
    },
    turnToPage (route) {
      let { path, params, query } = {}
      if (typeof route === 'string') path = route
      else {
        path = route.href
        params = route.params
        query = route.query
      }
      console.log(route)
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
