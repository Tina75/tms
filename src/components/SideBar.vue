<template>
  <div class="sider">
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
    </Menu>
    <div v-show="collapsed" class="menu-collapsed">
      <p class="title"><font-icon type="logo-1" size="32" color="white"/></p>
      <template v-for="item in menuList" >
        <div v-if="hasPower(item.powerCode)"  :key="item.path">
          <!-- <Poptip v-if="item.children" trigger="hover"  placement="left-start">
            <div v-for="child in item.children" slot="content" :key="child.path" @click="handleSelect(child.path)">
              <menu-item  v-if="hasPower(child.powerCode)" :name="child.path" :to="child.path" :key="child.path" >{{child.name}}</menu-item>
            </div>
            <a class="drop-menu-a"><font-icon :type="item.icon" :size="20" color="white"/></a>
          </Poptip> -->
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
    </div>
  </div>
</template>

<script>
import FontIcon from '@/components/FontIcon'
export default {
  components: { FontIcon },
  props: {
    collapsed: Boolean,
    activeName: String,
    menuList: Array
  },
  data () {
    return {
      openedNames: []
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
          element.query = Object.assign(element.query || {}, {title: element.name})
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
      return this.$store.state.permissions.includes(power)
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
.title
  font-size 20px
  color white
  text-align center
  line-height 52px
  height 50px
  padding 0
  margin 0
.menu-collapsed
  .drop-menu-a
    padding 6px 15px
    display inline-block
.icon
  display inline-block
  // vertical-align middle
</style>
