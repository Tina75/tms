<template>
  <Header class="header-con">
    <div class="header-bar">
      <div class="tag-nav-wrapper">
        <tab-nav/>
      </div>
      <div class="header-bar-avator-dropdown">
        <span class="header-bar-avator-dropdown-notify">
          <Tooltip v-if="processVisible" :value="processVisible" transfer  placement="bottom" content=" 业务流程" always>
            <router-link to="/help/process">
              <FontIcon  type="liucheng" size="25" color="#fff" ></FontIcon>
            </router-link>
          </Tooltip>
          <Tooltip v-else transfer content=" 业务流程">
            <router-link to="/help/process">
              <FontIcon  type="liucheng" size="25" color="#fff" ></FontIcon>
            </router-link>
          </Tooltip>
        </span>
        <span class="header-bar-avator-dropdown-notify">
          <Badge :count="MsgCount.all" :offset="[5,1]" type="primary">
            <Tooltip transfer content=" 消息">
              <router-link to="/information/index">
                <Icon type="ios-notifications" size="30" color="#fff"></Icon>
              </router-link>
            </Tooltip>
          </Badge>
        </span>

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
            <p style="text-align:center" class="i-mt-10"><Button type="default" @click="userLogout">&nbsp; &nbsp;退出&nbsp; &nbsp;</Button></p>
          </div>
        </Poptip>
      </div>
    </div>
  </Header>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import TabNav from './TabNav'
import FontIcon from '@/components/FontIcon'
import { mapGetters, mapActions } from 'vuex'
import TMSUrl from '@/libs/constant/url.js'
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
    ...mapGetters(['MsgCount', 'UserInfo'])
  },
  mounted () {
    window.EMA.bind('closeTab', (route) => { this.onTabClose(route) })
    // window.EMA.bind('reloadTab', (route) => {
    //   route.query = Object.assign({ _time: new Date().getTime() }, route.query)
    //   this.turnToPage(route)
    // })
    this.loopMessage()
    this.newUserTip()
  },
  methods: {
    ...mapActions(['getMessageCount', 'getUserInfo', 'getTableColumns', 'getOwnDrivers', 'getOwnCars', 'logout']),
    async newUserTip () {
      try {
        await this.getUserInfo()
        if (sessionStorage.getItem('first_time_login') === 'true') {
          if (this.UserInfo.type === 1) this.renew()
          else this.changePasswordTip()
          sessionStorage.removeItem('first_time_login')
        } else {
          // 短信是否超过次数
          this.isMessageBeyond()
        }
        this.getTableColumns()
        this.getOwnDrivers()
        this.getOwnCars()
        // 探索运掌柜
        await this.isPreviewDiscover()
        // 添加GA配置属性
        this.$ga.set('phone', this.UserInfo.phone)
        this.$ga.set('roleName', this.UserInfo.roleName)
        this.$ga.set('id', this.UserInfo.id)
      } catch (error) {

      }
    },
    /**
     * 超过短信上限
     */
    isMessageBeyond () {
      Server({
        url: 'message/beyondLimt',
        method: 'get'
      }).then(({ data }) => {
        if (data.data) {
          this.$Toast.warning({
            showIcon: false,
            okText: '我知道了',
            render (h) {
              return h('p', {
                style: {
                  textAlign: 'left',
                  marginLeft: '-20px'
                }
              }, data.data.content)
            }
          })
        }
      })
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
    /**
     * 用户退出
     */
    userLogout () {
      window.EMA.fire('logout')
      this.logout()
      location.reload()
      // this.$router.replace({ path: '/login' })
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
      // 提示流程图标提示
      if (route.path === TMSUrl.PROCESS && localStorage.getItem('first_time_login')) {
        this.processVisible = true
        setTimeout(() => {
          this.processVisible = false
        }, 3000)
        localStorage.removeItem('first_time_login')
      }
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
          } else if (firstBtn && firstBtn.click !== 1) {
            // 打开流程=点击打开，计入click数
            vm.previewedDiscover({ id: data.data.find(b => b.code === '100002').id })
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
      setTimeout(() => {
        window.EMA.fire('openTab', {
          path: TMSUrl.PROCESS,
          query: { title: '业务流程' }
        })
        localStorage.setItem('first_time_login', true)
      }, 1000)
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
    background-image url(../../../assets/default-avatar.jpg)
    background-size 30px
  &-bread-crumb
    padding-left 60px
    width 350px
    display inline-block
    float left
    background-image url(../../../assets/logo.png)
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
