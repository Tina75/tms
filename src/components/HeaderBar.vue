<template>
  <div class="header-bar">
    <a :class="['sider-trigger-a', collapsed ? 'collapsed' : '']"  type="text" @click="handleChange">
      <Icon type="ios-menu" size="26"/>
    </a>
    <div class="header-bar-avator-dropdown">
      <Dropdown>
        <Badge :count="100" type="primary">
          <Icon type="ios-notifications" size="26" color="#fff"></Icon>
        </Badge>
        <DropdownMenu slot="list">
          <DropdownItem name="1" >通知</DropdownItem>
          <DropdownItem name="2" >订单</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Dropdown @on-click="handleClick">
        <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" size="small"></avatar>
        <span style="color: #2d8cf0;min-width:50px;display:inline-block;text-align:right;">{{name}}  </span>
        <Icon type="md-arrow-dropdown" size="12"/>
        <DropdownMenu slot="list">
          <DropdownItem name="logout" >退出登录</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>

<script>
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
  methods: {
    handleChange () {
      this.$emit('on-coll-change', !this.collapsed)
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          window.EMA.fire('logout')
          break
      }
    }
  }
}
</script>
<style lang="stylus">
.sider-trigger-a
  width: 40px
  height 50px
  display inline-block
  text-align center
  color #5c6b77
  margin-top 13px
  float left
  i
    transition transform .2s ease
    vertical-align top
  &.collapsed i
    transform rotateZ(90deg)
    transition transform .2s ease
.header-bar
  width 100%
  height 100%
  position relative
  text-align left
  background #252A2F
  border-bottom 1px solid #efefef
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
    height 32px
    margin-top 15px
    vertical-align middle
    line-height 10px
    padding 0 15px 0
    &:hover
      cursor pointer
</style>
