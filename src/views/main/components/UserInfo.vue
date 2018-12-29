<template>
  <Poptip trigger="hover" class="header-user" transfer placement="bottom" popper-class="dropdown-info" title="账号信息" width="260" style="cursor: default">
    <Avatar :style="avatarStyle"  class="avatar"></avatar>
    <div class="user-info">
      <div>
        {{UserInfo.shortName || UserInfo.companyName}}
      </div>
      <div>
        {{UserInfo.name}}
      </div>
    </div>
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'user-info',
  props: {
    renew: Function
  },

  computed: {
    ...mapGetters(['UserInfo']),
    avatarStyle () {
      if (this.UserInfo.logoUrl) {
        return {
          backgroundImage: `url(${this.UserInfo.logoUrl})`
        }
      }
      return {}
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions(['logout']),
    /**
     * 用户退出
     * 1. 接口发现token失效，可能有其他用户登录，会包含msg
     * 2. 用户主动点击退出
     */
    userLogout () {
      window.EMA.fire('logout')
    }
  }
}
</script>

<style lang="stylus">
.header-user
  .avatar
    border 1px solid #fff
    background-image: url('../../../assets/default-avatar.jpg')
    background-size 30px
  .user-info
    width:132px;
    padding-left 10px
    display:inline-block;
    color white
    line-height 1.1
    margin-bottom -4px
    div
      top 10px
      position relative
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
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
</style>
