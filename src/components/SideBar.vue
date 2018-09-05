<template>
  <Menu  width="200"  theme="dark" active-name="1-1" @on-select="handleSelect">
    <p class="title">TMS</p>
    <template v-for="item in menuList">
      <template v-if="item.children">
        <Submenu :name="item.name" :key="item.href">
          <template slot="title">
            <Icon :type="item.icon" size="18"/>{{item.name}}
          </template>
          <menu-item v-for="child in item.children" :name="child.href" :key="child.name" :to="child.href">{{child.name}}</menu-item>
        </Submenu>
      </template>
      <template v-else>
        <menu-item :name="item.href" :to="item.href" :key="item.href"><Icon :type="item.icon" size="18"/>{{item.name}}</menu-item>
      </template>
    </template>
    <!-- <MenuItem name="/home"  to="/home"><Icon type="md-home"  size="18"/>首页</MenuItem>
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
      <MenuItem name="3-1" to="/"><span>订单管理</span></MenuItem>
      <MenuItem name="3-2" to="/">回单管理</MenuItem>
    </Submenu>
    <Submenu name="4">
      <template slot="title">
        <Icon type="md-bus" size="18"/>
        运输管理
      </template>
      <MenuItem name="/transport/dispatch" to="/transport/dispatch">调度工作台</MenuItem>
      <MenuItem name="/transport/waybill" to="/transport/waybill">运单管理</MenuItem>
      <MenuItem name="/transport/receiveOrder" to="/transport/receiveOrder">提货管理</MenuItem>
      <MenuItem name="/transport/outerOrder" to="/transport/outerOrder">外转单管理</MenuItem>
    </Submenu>
    <MenuItem name="5-1"><Icon type="md-options" size="18"/>财务</MenuItem>
    <MenuItem name="6-1"><Icon type="md-stats" size="18"/>报表</MenuItem>
    <MenuItem name="7-1"><Icon type="md-person" size="18"/>客户</MenuItem>
    <MenuItem name="8-1"><Icon type="md-briefcase" size="18"/>公司管理</MenuItem>
    <MenuItem name="9-1"><Icon type="md-settings" size="18"/>设置</MenuItem>
    <MenuItem name="10-1"><Icon type="md-help-circle" size="18"/>帮助</MenuItem> -->
  </Menu>
</template>

<script>
import menu from '@/assets/menu.json'
export default {
  data () {
    return {
      menuList: menu
    }
  },
  methods: {
    handleSelect (name) {
      let target = ''
      for (let i = 0; i < this.menuList.length; i++) {
        const element = this.menuList[i]
        target = walk(element)
        console.log('item->' + JSON.stringify(target))
        if (target) {
          this.$store.commit('changeTab', target)
          return
        }
      }

      function walk (element) {
        // console.log('walk->' + element.href)
        if (element.href === name) {
          return element
        } else if (element.children) {
          return element.children.find(item => {
            return walk(item)
          })
        } else {
          return ''
        }
      }
      // console.log('item->' + JSON.stringify(x))
      this.$emit('on-select', name)
      // this.$store.commit('changeTab', name)
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
