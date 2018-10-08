<template>
  <div class="header-bar">
    <a :class="['sider-trigger-a', collapsed ? 'collapsed' : '']"  type="text" @click="handleChange">
      <i class="icon font_family icon-shouji"></i>
    </a>
    <div class="header-bar-avator-dropdown">
      <Dropdown class="header-bar-avator-dropdown-notify">
        <Poptip trigger="hover" title="消息中心" content="暂无系统消息" width="300">
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
            <div class="msg-item" @click="openMsg(1)">
              <Badge :count="MsgCount.orderNum"  class="msg-item-count">
                <img src="../assets/icon-order-msg.png" alt="" width="34">
              </Badge>
              <p>订单消息</p>
            </div>
            <div class="msg-item" @click="openMsg(2)">
              <Badge :count="MsgCount.carrierNum" class="msg-item-count">
                <img src="../assets/icon-truck-msg.png" alt="" width="34">
              </Badge>
              <p>运输消息</p>
            </div>
          </div>
        </Poptip>
        <!-- <DropdownMenu slot="list">
          <DropdownItem name="1" >通知</DropdownItem>
          <DropdownItem name="2" >订单</DropdownItem>
        </DropdownMenu> -->
      </Dropdown>

      <!-- <Dropdown  class="header-bar-avator-dropdown" @on-click="handleClick"> -->
      <Poptip placement="bottom-end" title="账号信息" width="260">
        <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"  style="border:1px solid #fff"></avatar>
        <span class="user-info"><p>{{name}}</p> </span>
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
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'headerBar',
  props: {
    collapsed: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    },
    breadcrumbList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    ...mapGetters(['MsgCount', 'UserInfo'])
  },
  mounted () {
  },
  methods: {
    handleChange () {
      this.$emit('update:collapsed', !this.collapsed)
    },
    openMsg (type = 0) {
      this.$emit('on-open-msg', type)
    },
    logout () {
      window.EMA.fire('logout')
    },
    renew () {
      window.EMA.fire('Dialogs.push', {
        name: 'dialogs/renew',
        data: {
          title: '提示',
          expirationTime: this.UserInfo.expirationTime
        }
      })
    }
  }
}
</script>
<style lang="stylus">
.sider-trigger-a
  width: 25px
  height 50px
  display inline-block
  text-align center
  color #5c6b77
  background #3A424B
  float left
  i
    transition transform .2s ease
    vertical-align top
    color #ffffff
.collapsed
  transform rotateZ(180deg)
  transition transform .2s ease
.header-bar
  width 100%
  height 100%
  position relative
  text-align left
  background #252A2F
  color #fff
  // border-bottom 1px solid #efefef
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
