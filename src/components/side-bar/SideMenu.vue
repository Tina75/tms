
<template>
  <div class="sider">
    <Sider v-model="collapsed" :collapsed-width="50" hide-trigger collapsible style="overflow:hidden">
      <Menu v-show="!collapsed" ref="menu" :active-name="$route.path" :open-names="openedNames" accordion width="200" theme="dark" @on-select="handleSelect">
        <div class="title"><font-icon type="logo-zjy1" size="24" color="white"/></div>
        <template v-for="item in menuList">
          <template v-if="item.children">
            <Submenu v-if="hasPower(item.powerCode)" :name="item.path" :key="item.path">
              <template slot="title"><font-icon :type="item.icon" :size="18" />{{item.name}}</template>
              <menu-item v-for="child in item.children" v-if="hasPower(child.powerCode)" :name="child.path" :key="child.path" >{{child.name}}</menu-item>
            </Submenu>
          </template>
          <template v-else>
            <menu-item v-if="hasPower(item.powerCode)" :name="item.path" :key="item.path"><font-icon :type="item.icon" :size="18"></font-icon>{{item.name}}</menu-item>
          </template>
        </template>
        <div class="footer">
          <div>
            <font-icon type="ico-call" size="28" color="#aaa"/>
            <span >
              <p>客服电话</p>
              <p style="font-size:13px">025-66606056</p>
            </span>
          </div>
        </div>
      </Menu>
      <div v-show="collapsed" class="menu-collapsed">
        <p class="title"><font-icon type="logo-1" size="32" color="white"/></p>
        <template v-for="item in menuList" >
          <div v-if="hasPower(item.powerCode)"  :key="item.path">
            <Dropdown v-if="item.children" placement="right-start" transfer >
              <a class="drop-menu-a"><font-icon :type="item.icon" :size="20" color="white"/></a>
              <DropdownMenu slot="list" >
                <DropdownItem v-for="child in item.children"  :key="child.path" >
                  <p v-if="hasPower(child.powerCode)" :name="child.path" :key="child.path"  @click="handleSelect(child)">{{child.name}}</p>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Tooltip v-else :content="item.name" transfer placement="left">
              <menu-item v-if="hasPower(item.powerCode)"  :name="item.path"><a class="drop-menu-a"  @click="handleSelect(item)"><font-icon :type="item.icon" :size="20" color="white"/></a></menu-item>
            </Tooltip>
          </div>
        </template>
        <p class="footer footer-collapsed">
          <Tooltip content="025-66606056" transfer placement="left">
            <div>
              <font-icon type="ico-call" size="24" color="white"/>
            </div>
          </Tooltip>
        </p>
      </div>
    </sider>
  </div>
</template>

<script>
import FontIcon from '@/components/FontIcon'
import menuJson from '@/assets/menu.json'

export default {
  components: { FontIcon },
  props: {
    collapsed: Boolean,
    activeName: String
  },
  data () {
    return {
      openedNames: [],
      menuList: menuJson
    }
  },
  watch: {
    activeName (val) {
      this.openedNames = this.getopenedNames(val)
    },
    openedNames (val) {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened()
      })
    }
  },
  mounted () {
    this.openedNames = this.getopenedNames(this.activeName)
  },
  methods: {

    getopenedNames (activeName) {
      /**
       * 订单管理菜单分割
       * 1. 订单管理合并到受理开单
       * 2. 回单管理合并到运输管理
       */
      if (activeName.indexOf('order-management') !== -1) {
        if (activeName.indexOf('receipt') !== -1) {
          return ['/transport']
        }
        return ['/order']
      }
      const matchs = activeName.split('/')
      return ['/' + matchs[1]]
    },
    handleSelect (route) {
      let target = ''
      const path = typeof route === 'object' ? route.path : route
      for (let i = 0; i < this.menuList.length; i++) {
        const element = this.menuList[i]
        target = walk(element)
        if (target) {
          this.$emit('on-select', target)
          return
        }
      }
      function walk (element) {
        if (element.path === path) {
          element.query = Object.assign(element.query || {}, { title: element.name })
          return element
        } else if (element.children) {
          return element.children.find(item => {
            return walk(item)
          })
        } else {
          return ''
        }
      }
    },
    // 权限控制
    hasPower: function (power) {
      if (!power) { return true }
      return this.$store.state.permissions.includes(power + '')
    //   var flag = false
    //   var powerArr = (power || '').split(',') || []
    //   var list = window.powerList
    //   list.forEach((value) => {
    //     if (powerArr.indexOf(value.toString()) !== -1) {
    //       flag = true
    //       return false
    //     }
    //   })
    //   return flag
    }
  }
}
</script>

<style lang="stylus" scoped>
.sider
  z-index 10
  padding-bottom 50px
  .title
    font-size 20px
    color white
    text-align center
    line-height 52px
    text-indent -5%
    height 50px
    padding 0
    margin 0
@keyframes move_in{
  0%{width: 40px;}
  80%{width: 80px;}
  100%{width: 180px;}
  }

@keyframes move_out{
  0%{width:180px;}
  50%{width:100px;}
  100%{width:50px;}
  }

.footer
  border-top 1px solid rgba(255,255,255,0.1)
  text-align center
  position fixed
  padding-top 5px
  padding-bottom 2px
  width 200px
  height 50px
  overflow hidden
  animation move_in .2s;
  bottom 0
  left 0
  color #aaa
  background #252A2F
  z-index 1000
  font-size 12px
  &-collapsed
    width 50px
    animation move_out .2s;
    margin-left 0
    &>div
      width 50px
  span
    text-align left
    margin-left 10px
    display inline-block
    width 100px
    p
      line-height 1.1
      font-size 12px
      margin 0
      padding 0
.menu-collapsed
  .drop-menu-a
    padding 6px 15px
    display inline-block
.icon
  display inline-block
  // vertical-align middle
</style>
