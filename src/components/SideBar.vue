<template>
  <Menu  width="200"  theme="dark" active-name="1-1" @on-select="handleSelect">
    <p class="title">TMS</p>
    <MenuItem name="/home"  to="/home"><Icon type="md-home"  size="18"/>首页</MenuItem>
    <Submenu name="2">
      <template slot="title">
        <Icon type="md-paper" size="18"/>
        受理开单
      </template>
      <MenuItem name="2-1" to="/">手动下单</MenuItem>
      <MenuItem name="2-2" to="/">批量导入</MenuItem>
    </Submenu>
    <Submenu name="3">
      <template slot="title">
        <Icon type="md-list-box" size="18"/>
        订单管理
      </template>
      <MenuItem name="3-1" to="/">订单管理</MenuItem>
      <MenuItem name="3-2" to="/">回单管理</MenuItem>
    </Submenu>
    <Submenu name="4">
      <template slot="title">
        <Icon type="md-bus" size="18"/>
        运输管理
      </template>
      <MenuItem name="4-1" to="/">调度工作台</MenuItem>
      <MenuItem name="4-2" to="/">运单管理</MenuItem>
      <MenuItem name="4-3" to="/">提货管理</MenuItem>
      <MenuItem name="4-4" to="/">外转单管理</MenuItem>
    </Submenu>
    <MenuItem name="5-1"><Icon type="md-options" size="18"/>财务</MenuItem>
    <MenuItem name="6-1"><Icon type="md-stats" size="18"/>报表</MenuItem>
    <MenuItem name="7-1"><Icon type="md-person" size="18"/>客户</MenuItem>
    <MenuItem name="8-1"><Icon type="md-briefcase" size="18"/>公司管理</MenuItem>
    <MenuItem name="9-1"><Icon type="md-settings" size="18"/>设置</MenuItem>
    <MenuItem name="10-1"><Icon type="md-help-circle" size="18"/>帮助</MenuItem>
  </Menu>
</template>

<script>

export default {
  methods: {
    handleSelect (name) {
      this.$store.commit('changeTab', name)
    }
  }
}
</script>

<style lang="stylus" scoped>
.title
  font-size 20px
  color white
  text-align center
  line-height 49px
  padding 0
  margin 0
</style>
