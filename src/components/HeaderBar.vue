<template>
  <Header class="header-con">
    <div class="header-bar">
      <div class="tag-nav-wrapper">
        <tab-nav :list="TabNavList" :value="$route" @on-close="onTabClose" @on-select="onTabSelect"/>
      </div>
      <div class="header-bar-avator-dropdown">
        <span class="header-bar-avator-dropdown-notify" @click="openProcess">
          <Tooltip v-if="processVisible" :value="processVisible" transfer  placement="bottom" content=" 业务流程" always>
            <FontIcon type="liucheng" size="25" color="#fff"></FontIcon>
          </Tooltip>
          <Tooltip v-else transfer content=" 业务流程">
            <FontIcon  type="liucheng" size="25" color="#fff" ></FontIcon>
          </Tooltip>
        </span>
        <span class="header-bar-avator-dropdown-notify">
          <Badge :count="MsgCount.all" :offset="[5,1]" type="primary">
            <Tooltip transfer content=" 消息">
              <Icon type="ios-notifications" size="30" color="#fff" @click="openMsg(0)"></Icon>
            </Tooltip>
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
        <Poptip trigger="hover" transfer placement="bottom-end" popper-class="dropdown-info" title="账号信息" width="260" style="cursor: default">
          <Avatar class="avatar"  style="border:1px solid #fff"></avatar>
          <span class="user-info">{{UserInfo.name}}</span>
          <Icon type="md-arrow-dropdown" class="i-mr-10" size="14"/>
          <div slot="content">
            <p class="dropdown-line"><label for="">账户名：</label><span class="content-name">{{UserInfo.name}}</span><Tag color="cyan" style="font-size:12px;cursor: default">{{UserInfo.roleName}}</Tag></p>
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
import FontIcon from '@/components/FontIcon'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import TMSUrl from '../libs/constant/url.js'
import Server from '@/libs/js/server'
export default {
  name: 'headerBar',
  components: { TabNav, FontIcon },
  mixins: [BaseComponent],
  data () {
    return {
      processVisible: false
    }
  },
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
    ...mapActions(['getMessageCount', 'getUserInfo']),
    async newUserTip () {
      try {
        await this.getUserInfo()

        // 添加GA配置属性
        this.$ga.set('phone', this.UserInfo.phone)
        this.$ga.set('roleName', this.UserInfo.roleName)
        this.$ga.set('id', this.UserInfo.id)
        // 探索运掌柜
        this.isPreviewDiscover()
      } catch (error) {

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
    /**
     * 打开业务流程
     */
    openProcess () {
      window.EMA.fire('openTab', {
        path: TMSUrl.PROCESS,
        query: {
          title: '业务流程'
        }
      })
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
      // this.$Modal.confirm({
      //   title: '提示',
      //   content: '<p>您的密码为初始密码，为确保账户安全，请及时修改密码</p>',
      //   okText: '立即修改',
      //   cancelText: '我知道了',
      //   onOk: () => {
      //     window.EMA.fire('openTab', { path: '/set-up/index', query: { title: '设置' } })
      //   }
      // })
      this.$Toast.confirm({
        title: '提示',
        showIcon: false,
        content: '<i class="ivu-icon ivu-icon-ios-help-circle" style="color:#ff9502;font-size:28px"></i>&nbsp;您的密码为初始密码，为确保账户安全，请及时修改密码',
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
      // 提示流程图标提示
      if (route.path === TMSUrl.PROCESS && localStorage.getItem('first_time_login')) {
        this.processVisible = true
        setTimeout(() => {
          this.processVisible = false
        }, 3000)
        localStorage.removeItem('first_time_login')
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
    },

    // 是否第一次探索运掌柜
    isPreviewDiscover () {
      let vm = this
      let firstBtn = {}
      let roleBtnNum = 0
      Server({
        url: '/discover/list',
        method: 'get'
      }).then(({ data }) => {
        if (data.code === 10000) {
          firstBtn = data.data.find(b => b.code === '100001' && b.click !== 1)
          data.data.forEach(element => {
            if (element.role === 1) roleBtnNum++
          })
          // roleBtnNum > 2 （按钮集合中有一个是初次登录标识按钮）
          if (firstBtn && roleBtnNum > 2) {
            setTimeout(() => {
              window.EMA.fire('openTab', {
                path: TMSUrl.HELP,
                query: { title: '帮助', descover: '0' }
              })
            }, 1000)
          } else {
            vm.isOpenProcess()
          }
        }
      }).then(() => {
        if (firstBtn) vm.previewedDiscover({ id: firstBtn.id })
      })
    },

    // 探索一次后将不再探索
    previewedDiscover (params) {
      Server({
        url: '/discover/look',
        method: 'post',
        data: params
      }).then(({ data }) => {
      })
    },

    /**
     * 用户首次注册登录系统
     * 1. 超级管理员提示系统有效期，同时打开流程图标签
     * 2. 非管理员，提示初始化密码，同时打开流程图标签
     */
    isOpenProcess () {
      if (sessionStorage.getItem('first_time_login') === 'true') {
        if (this.UserInfo.type === 1) this.renew()
        else this.changePasswordTip()
        setTimeout(() => {
          window.EMA.fire('openTab', {
            path: TMSUrl.PROCESS,
            query: { title: '业务流程' }
          })
          localStorage.setItem('first_time_login', true)
        }, 1000)
        sessionStorage.removeItem('first_time_login')
      }
    }
  }
}
</script>
<style lang="stylus">
.dropdown-info
  .dropdown-line
    padding 5px 0px
    color #555555
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
    max-width 230px
    .content-name
      width 80px
      overflow hidden
      display inline-block
      text-overflow ellipsis
      margin-bottom -6px
    label
      min-width 60px
      text-align left
      display inline-block
.header-con
  position relative
  z-index 9
  width 100%
  .tag-nav-wrapper
    width auto
    top 4px
    left 0
    right 250px
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
  .content-name
    width 80px
    overflow hidden
    display inline-block
    text-overflow ellipsis
    margin-bottom -6px
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
    vertical-align middle
    // .dropdown-box
    //   text-align center
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
      .font_family
        vertical-align middle
      .msg
        display: -webkit-flex;
        display flex
        display -ms-flexbox
        &-item
          display inline-block
          flex 1
          -ms-flex 1
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
    width:65px;
    padding-left 5px
    display:inline-block;
    color white
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
    line-height 1.1
    margin-bottom -4px
</style>
