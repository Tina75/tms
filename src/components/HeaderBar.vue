<template>
  <Header class="header-con">
    <div class="header-bar">
      <div class="tag-nav-wrapper">
        <tab-nav :list="TabNavList" :value="$route" @on-close="onTabClose" @on-select="onTabSelect"/>
      </div>
      <div class="header-bar-avator-dropdown">
        <span class="header-bar-avator-dropdown-notify">
          <Badge :count="MsgCount.all" type="primary">
            <Icon type="ios-notifications" size="30" color="#fff" @click="openMsg(0)"></Icon>
          </Badge>
        </span>
        <!-- <Dropdown class="header-bar-avator-dropdown-notify">
        <Poptip trigger="hover" title="消息中心" content="暂无系统消息" >
          <Badge :count="MsgCount.all" type="primary">
            <Icon type="ios-notifications" size="30" color="#fff"></Icon>
          </Badge>
          <div slot="content" class="msg">
            <div class="msg-item" @click="openMsg(0)">
              <Badge :count="MsgCount.sysNum"  class="msg-item-count">
                <img src="../assets/icon-system-msg.png" alt="" width="34">
              </Badge>
              <p>系统消息</p>
            </div>
            <div v-if="hasPower('110000')" class="msg-item" @click="openMsg(1)">
              <Badge :count="MsgCount.orderNum"  class="msg-item-count">
                <img src="../assets/icon-order-msg.png" alt="" width="34">
              </Badge>
              <p>订单消息</p>
            </div>
            <div v-if="hasPower('120000')" class="msg-item" @click="openMsg(2)">
              <Badge :count="MsgCount.carrierNum" class="msg-item-count">
                <img src="../assets/icon-truck-msg.png" alt="" width="34">
              </Badge>
              <p>运输消息</p>
            </div>
          </div>
        </Poptip>
      </Dropdown> -->

        <!-- <Dropdown  class="header-bar-avator-dropdown" @on-click="handleClick"> -->
        <Poptip trigger="hover"  placement="bottom-end" title="账号信息" width="260">
          <Avatar class="avatar"  style="border:1px solid #fff"></avatar>
          <span class="user-info"><p>{{UserInfo.name}}</p> </span>
          <Icon type="md-arrow-dropdown" class="i-mr-10" size="14"/>
          <div slot="content">
            <p class="dropdown-line"><label for="">账户名：</label>{{UserInfo.name}} &nbsp; &nbsp; &nbsp; &nbsp;<Tag color="cyan" style="font-size:12px">{{UserInfo.roleName}}</Tag></p>
            <p class="dropdown-line"><label for="">手机号：</label>{{UserInfo.phone}}</p>
            <p class="dropdown-line"><label for="">公司：</label>{{UserInfo.companyName}}</p>
            <p class="dropdown-line"><label for="">有效期至：</label>{{UserInfo.expirationTime | datetime('yyyy-MM-dd')}}</p>
            <p class="dropdown-line"><a @click="renew">延长账号有效期</a></p>
            <p style="text-align:center" class="i-mt-10"><Button type="default" @click="logout">&nbsp; &nbsp;退出&nbsp; &nbsp;</Button></p>
          </div>
        </Poptip>
      </div>
    </div>
  </Header>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import TabNav from '@/components/TabNav'

import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'headerBar',
  components: { TabNav },
  mixins: [BaseComponent],
  computed: {
    ...mapGetters(['MsgCount', 'UserInfo', 'TabNavList'])
  },
  mounted () {
    window.EMA.bind('closeTab', (route) => { this.onTabClose(route) })
    window.EMA.bind('reloadTab', (route) => {
      route.query = Object.assign({ _time: new Date().getTime() }, route.query)
      this.turnToPage(route)
    })
    this.loopMessage()
    this.newUserTip()
  },
  methods: {
    ...mapMutations(['setTabNavList']),
    ...mapActions(['getMessageCount']),
    newUserTip () {
      if (sessionStorage.getItem('first_time_login') === 'true') {
        if (this.UserInfo.type === 1) this.renew()
        else this.changePasswordTip()
        sessionStorage.removeItem('first_time_login')
      }
    },
    loopMessage () {
      this.getMessageCount()
      setInterval(() => {
        this.getMessageCount()
      }, 60 * 1000)
    },
    /**
    * @description 打开消息tab
    * @param type 消息类型
    */
    openMsg (type = 0) {
      const route = { path: '/information/index', query: { type: type, title: '消息' } }
      window.EMA.fire('openTab', route)
    },
    logout () {
      window.EMA.fire('logout')
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
    }

  }
}
</script>
<style lang="stylus">
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
.header-bar
  width 100%
  height 100%
  position relative
  text-align left
  background #252A2F
  color #fff
  // border-bottom 1px solid #efefef
  .avatar
    background-image url(../assets/default-avatar.jpg)
    background-size 30px
  &-bread-crumb
    padding-left 60px
    width 350px
    display inline-block
    float left
    background-image url(../assets/logo.png)
    background-repeat no-repeat
    background-size 26px
    background-position 24px 20px
  &-content-con
    float right
    height auto
  &-avator-dropdown
    float right
    display inline-block
    margin-top 8px
    vertical-align middle
    line-height 10px
    // .dropdown-box
    //   text-align center
    .dropdown-line
      padding 5px 0px
      color #555555
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      max-width 230px
      label
        min-width 60px
        text-align left
        display inline-block
    .ivu-badge-count
      top: -2px;
      right: 4px;
      padding: 0 3px;
      min-width 0
      box-shadow: 0 0 0 1px #000;
      line-height: 12px;
      height 14px
    &:hover
      cursor pointer
    &-notify
      margin-top 3px
      margin-right 20px
      .msg
        display: -webkit-flex;
        display flex
        &-item
          display inline-block
          flex 1
          text-align center
          color #555555
          font-size 12px
          min-width 80px
          &-count .ivu-badge-count
            box-shadow: none;
            margin-top 8px
            right 0
          img
            display inline-block
            padding-top 12px

  .user-info
    width:60px;
    padding-left 5px
    display:inline-block;
    color white
</style>
