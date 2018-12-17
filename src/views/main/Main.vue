<template>
  <div id="app">
    <Layout class="container">
      <c-sider></c-sider>
      <Layout class="right-con">
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
export default {
  components: { CHeader, CDialog, CSider, CContent },
  methods: {
    ...mapActions(['getTableColumns']),
    ...mapMutations(['setTabNavList', 'initTabNav'])
  }
}
</script>

<style lang="stylus">
@import "../../libs/css/helper"
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
  .sider
    float: unquote(left\9)
  .ivu-layout-sider-children .ivu-menu-dark .ivu-menu-item
    max-height 49px
  .container
    height 100vh
    background #EFEFEF
    flex-direction row
    overflow hidden
    .right-con
      z-index 10
</style>
