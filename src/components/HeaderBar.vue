<template>
  <div class="header-bar">
    <a :class="['sider-trigger-a', collapsed ? 'collapsed' : '']"  type="text" @click="handleChange">
      <Icon type="ios-menu" size="26"/>
    </a>
    <div class="header-bar-bread-crumb">
      <Breadcrumb>
        <BreadcrumbItem v-for="item in breadcrumbList" :key="item.name" @click.native="$route.push({name: item.name})">
          {{item.title}}
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="header-bar-avator-dropdown">
      <Dropdown @on-click="handleClick">
        <span style="color: #2d8cf0">{{name}}  </span>
        <Icon style="color: #2d8cf0" type="arrow-down-b" size="12"/>
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
      console.log('sss')
      this.$emit('on-coll-change', !this.collapsed)
    },
    handleClick (name) {
      switch (name) {
        case 'logout':
          localStorage.clear()
          window.location.reload()
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
  margin-top 12px
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
  border-bottom 1px solid rgba(238,238,238,1)
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
    margin-top 20px
    vertical-align middle
    line-height 10px
    padding 0 15px 0
    &:hover
      cursor pointer
</style>
