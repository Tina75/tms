<template>
  <Header class="header-con">
    <div class="header-bar">
      <div class="tag-nav-wrapper">
        <tab-nav/>
      </div>
      <div class="info">
        <div class="company">
          <Avatar v-imgFormat="UserInfo.logoUrl" v-if="UserInfo.logoUrl" :style="'background-image: url(' + UserInfo.logoUrl +')'" class="avatar"></Avatar>
          <!--<Avatar v-else class="avatar"></Avatar>-->
          <!--公司简称-->
          <span v-if="UserInfo.shortName" class="title">{{UserInfo.shortName}}</span>
          <span v-else class="title">{{UserInfo.companyName}}</span>
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
            <Badge :count="MsgCount.all" :offset="[8,3]" type="primary">
              <Tooltip transfer content=" 消息">
                <router-link to="/information/index">
                  <Icon type="ios-notifications" size="30" color="#fff"></Icon>
                </router-link>
              </Tooltip>
            </Badge>
          </span>
          <UserInfo :renew="renew"></UserInfo>
        </div>
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
import UserInfo from './UserInfo.vue'
const LocalStorageKeys = {
  FIRST_TIME_LOGIN: 'first_time_login', // 注册后第一次登录
  TMS_CLEAR_TRIAL: 'TMS_clear_trial',
  TMS_FIRST_DISCOVERY: 'TMS_first_discovery' // 探索运掌柜
}
export default {
  name: 'headerBar',
  components: { TabNav, FontIcon, UserInfo },
  mixins: [BaseComponent],
  data () {
    return {
      processVisible: false,
      messageTimer: null,
      popupQueue: []
    }
  },
  computed: {
    ...mapGetters(['MsgCount', 'UserInfo', 'IsUserLogin'])
  },
  mounted () {
    const vm = this
    window.EMA.bind('on-close', vm.onTabClose)
    // 用户登录后，初始化配置
    if (vm.IsUserLogin) {
      vm.loopMessage()

      vm.newUserTip()
    }
  },
  beforeDestroy () {
    if (this.messageTimer) {
      clearInterval(this.messageTimer)
      this.messageTimer = null
    }
  },
  methods: {
    ...mapActions(['getMessageCount', 'getUserInfo', 'getTableColumns', 'getOwnDrivers', 'getOwnCars', 'getConfiguration']),
    async newUserTip () {
      try {
        // await this.getUserInfo()
        if (sessionStorage.getItem('first_time_login') === 'true') {
          if (this.UserInfo.type === 1) this.renew()
          else this.changePasswordTip()
          // 探索运掌柜
          this.isPreviewDiscover()
          sessionStorage.removeItem('first_time_login')
        } else {
          // 是否需要清空试用期的数据
          // this.clearTrialData()
          // 接受邀请合作
          // this.receiveInvitingCooperation()
          // 短信是否超过次数
          // this.messageBeyondLimit()
          this.popupQueue.push(this.systemUpgradeNotice, this.clearTrialData, this.receiveInvitingCooperation, this.messageBeyondLimit)
        }
        this.popupQueue.push(this.inspectionTip, this.insuranceTip)
        this.$nextTick(() => {
          this.orderedInvoke()
        })
        this.getTableColumns()
        // 查询所有的自有车辆和未绑定的司机
        this.getOwnDrivers()
        this.getOwnCars()
        // 获取开单全局配置
        this.getConfiguration()
        // 添加GA配置属性
        this.$ga.set('phone', this.UserInfo.phone)
        this.$ga.set('roleName', this.UserInfo.roleName)
        this.$ga.set('id', this.UserInfo.id)
      } catch (error) {

      }
    },

    /**
     * 依次执行弹窗
     */
    orderedInvoke () {
      const vm = this
      if (this.popupQueue.length > 0) {
        let index = 0
        let next = () => {
          let invokedFunction = vm.popupQueue[index]

          if (invokedFunction && typeof invokedFunction === 'function') {
            vm.$nextTick(() => {
              invokedFunction.call(vm)
                .then(result => {
                  index++
                  setTimeout(() => {
                    next()
                  }, 1000)
                })
                .catch((error) => {
                  vm.popupQueue = []
                  throw error
                })
            })
          } else {
            vm.popupQueue = []
          }
        }
        next()
      }
    },
    /**
     * 查询系统更新消息
     */
    systemUpgradeNotice () {
      // 查询系统更新消息
      return new Promise((resolve, reject) => {
        Server({
          url: 'message/sysSms',
          method: 'get'
        })
          .then((res) => {
            if (res && res.data.code === 10000) {
              const upgradeMessage = res.data.data
              if (!upgradeMessage.id) {
                resolve()
                return
              }
              // 弹出更新消息窗口
              window.EMA.fire('Dialogs.push', {
                name: 'home/dialogs/upgrade',
                data: {
                  title: upgradeMessage.title,
                  content: upgradeMessage.content
                },
                methods: {
                  ok () {
                  // 删除系统更新消息
                    Server({
                      url: 'message/sysSmsDel',
                      method: 'get',
                      params: {
                        id: upgradeMessage.id
                      }
                    })
                    resolve()
                  },
                  cancel () {
                    resolve()
                  }
                }
              })
            } else {
              resolve()
            }
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /**
     * 接受货主发送的邀请合作请求
     */
    receiveInvitingCooperation () {
      const vm = this
      return new Promise((resolve, reject) => {
        Server({
          url: 'message/inviteMessage',
          method: 'get'
        })
          .then((res) => {
            if (res.data.data) {
              /**
               * data{id,title,content,phone, inviteId}
               * 合作邀请可能存在多个合作消息
               * 1. 单个消息后端接口会返回inviteId,
               * 2. 多个就不返回inviteId,phone,需要提示去消息处理
               */
              let { phone, inviteId, content } = res.data.data
              if (inviteId) {
                window.EMA.fire('Dialogs.push', {
                  name: 'dialogs/invite-cooperation',
                  data: {
                    title: '温馨提示',
                    phone,
                    inviteId,
                    content
                  },
                  methods: {
                    ok () {
                      resolve()
                    },
                    cancel () {
                      resolve()
                    }
                  }
                })
              } else {
                vm.$Toast.info({
                  title: '货主合作邀请',
                  showIcon: true,
                  content: '有多位货主邀请您进行线上合作',
                  okText: '查看消息',
                  render (h) {
                    return h('p', {
                      style: {
                        textAlign: 'left'
                      }
                    }, '直接从系统指派订单给贵公司运输，以便提高运作效率。')
                  },
                  onOk: () => {
                    window.EMA.fire('openTab', {
                      path: TMSUrl.MESSAGE_CENTER,
                      query: {
                        title: '消息'
                      }
                    })
                    resolve()
                  },
                  onCancel: () => {
                    resolve()
                  }
                })
              }
            }
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /**
     * 需要清除试用期期间的脏数据
     */
    clearTrialData () {
      return new Promise((resolve, reject) => {
        if (localStorage.getItem(LocalStorageKeys.TMS_CLEAR_TRIAL)) {
          resolve()
        }
        if (this.UserInfo.type === 1) {
          Server({
            url: 'message/userMessage',
            method: 'get'
          })
            .then(({ data }) => {
              /**
               * data = {id,title,content,beginTime,endTime}
               */
              if (data.data) {
                window.EMA.fire('Dialogs.push', {
                  name: 'dialogs/clear-trial-data',
                  data: {
                    ...data.data,
                    title: '试用期数据删除'
                  },
                  methods: {
                    ok () {
                      localStorage.setItem(LocalStorageKeys.TMS_CLEAR_TRIAL, 1)
                      resolve()
                    },
                    cancel () {
                      localStorage.setItem(LocalStorageKeys.TMS_CLEAR_TRIAL, 1)
                      resolve()
                    }
                  }
                })
              }
            })
            .catch((error) => {
              reject(error)
            })
        }
        resolve()
      })
    },

    /**
     * 超过短信上限
     */
    messageBeyondLimit () {
      return new Promise((resolve, reject) => {
        Server({
          url: 'message/beyondLimt',
          method: 'get'
        })
          .then(({ data }) => {
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
                },
                onOk () {
                  resolve()
                },
                onCancel () {
                  resolve()
                }
              })
            }
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /**
     * 循环查询消息
     */
    loopMessage () {
      this.getMessageCount()
      this.messageTimer = setInterval(() => {
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

    inspectionTip () {
      return new Promise((resolve, reject) => {
        // Server({
        //   url: 'message/beyondLimt',
        //   method: 'get'
        // })
        // .then(({ data }) => {
        // if (data.data) {
        this.$Toast.confirm({
          title: '年检提醒',
          showIcon: false,
          content: '年检提醒111111111111111111111111',
          okText: '去查看',
          cancelText: '我知道了',
          onOk: () => {
            window.EMA.fire('openTab', { path: '/information/index', query: { title: '消息' } })
            resolve()
          },
          onCancel: () => {
            resolve()
          }
        })
        // }
        // })
        // .catch((error) => {
        //   reject(error)
        // })
      })
    },

    insuranceTip () {
      return new Promise((resolve, reject) => {
        this.$Toast.confirm({
          title: '保险提醒',
          showIcon: false,
          content: '保险提醒2222222222222222222222222',
          okText: '去查看',
          cancelText: '我知道了',
          onOk: () => {
            window.EMA.fire('openTab', { path: '/information/index', query: { title: '消息' } })
            resolve()
          },
          onCancel: () => {
            resolve()
          }
        })
        // .catch((error) => {
        //   reject(error)
        // })
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
.header-con
  height 90px!important
  position relative
  z-index 9
  width 100%
  /deep/
    .btn-con.right-btn
      border-right none
  .tag-nav-wrapper
    width auto
    top 44px
    left 0
    right 10px
    position absolute
    padding 0
    height 46px
    z-index 9
    // background #F0F0F0
    overflow hidden
    .tags-nav .scroll-outer .scroll-body
      bottom -1px
      /deep/
        .btn-con.right-btn
          border-right none
.header-bar
  width 100%
  height 90px
  position relative
  text-align left
  background #252A2F
  color #fff
  padding-right 10px
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
  .info
    border-left 1px solid #3a424b
    overflow hidden
    .company
      background none
      line-height 44px
      float left
      padding-left 10px
      padding-top 2px
      .avatar
        border-radius 0
        display inline-block
        vertical-align middle
        border 1px solid #fff
        width 35px
        height 35px
        background-image: url('../../../assets/company_logo.png')
        background-size 33px
      .title
        margin-left 15px
        line-height 44px
        font-size 16px
</style>
