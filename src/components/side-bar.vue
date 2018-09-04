<template>
  <Menu  width="200"  theme="dark" active-name="1-1">
    <p class="title">TMS</p>
    <MenuItem name="1-1" to="/home"><Icon type="ios-settings-outline" size="14"/>组织架构</MenuItem>
    <Submenu name="2">
      <template slot="title">
        <Icon type="ios-people" size="18"/>
        用户管理
      </template>
      <MenuItem name="2-1" to="/verify/user">用户审核</MenuItem>
      <MenuItem name="2-2" to="/verify/line">专线公司审核</MenuItem>
      <MenuItem name="2-3" to="/verify/shipper">货主公司审核</MenuItem>
      <MenuItem name="2-4" to="/verify/search">用户查询</MenuItem>
    </Submenu>
    <!-- <Submenu name="4">
      <template slot="title">
        <Icon type="ios-gear" size="18"/>
        Navigation Three
      </template> -->
    <MenuItem name="4-1"><Icon type="md-reorder" size="18"/>订单管理</MenuItem>
    <!-- <MenuItem name="4-2">Option 10</MenuItem> -->
    <!-- <MenuItem name="4-3">Option 11</MenuItem> -->
    <!-- <MenuItem name="4-4">Option 12</MenuItem> -->
    <!-- </Submenu> -->
    <MenuItem name="5-1" to="/withdraw/list"><Icon type="ios-card" size="18"/>提现管理</MenuItem>
  </Menu>
</template>

<script>
export default {

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
