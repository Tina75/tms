<template>
  <div class="sider">
    <Menu v-show="!collapsed" ref="menu"  :active-name="$route.path === '/'?'/home':$route.path" :open-names="openedNames"  accordion width="200" theme="dark" @on-select="handleSelect">
      <div class="title"><i class="icon font_family icon-logo-zjy" ></i></div>
      <template v-for="item in menuList">
        <template v-if="item.children">
          <Submenu v-if="hasPower(item.powerCode)" :name="item.path" :key="item.path">
            <template slot="title"><FontIcon :type="item.icon" :size="16" ></FontIcon>{{item.name}}</template>
            <menu-item v-for="child in item.children" v-if="hasPower(child.powerCode)" :name="child.path" :key="child.name" >{{child.name}}</menu-item>
          </Submenu>
        </template>
        <template v-else>
          <menu-item v-if="hasPower(item.powerCode)" :name="item.path"  :key="item.path"><FontIcon :type="item.icon" :size="18"></FontIcon>{{item.name}}</menu-item>
        </template>
      </template>
    </Menu>
    <div v-show="collapsed" class="menu-collapsed">
      <p class="title"><i class="icon font_family icon-logo-1"></i></p>
      <template v-for="item in menuList" >
        <div v-if="hasPower(item.powerCode)"  :key="item.path">
          <Poptip v-if="item.children" trigger="hover"  placement="left-start">
            <div v-for="child in item.children" slot="content" :key="child.path" @click="handleSelect(child.path)">
              <menu-item  v-if="hasPower(child.powerCode)" :name="child.path" :to="child.path" :key="child.path" >{{child.name}}</menu-item>
            </div>
            <a class="drop-menu-a"><FontIcon :type="item.icon" :size="20" color="white"></FontIcon></a>
          </Poptip>
          <Tooltip v-else :content="item.name" transfer placement="left">
            <a  :href="`#${item.path}`" class="drop-menu-a">
              <FontIcon :type="item.icon" :size="20" color="white"></FontIcon>
            </a>
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
    handleSelect (name) {
      let target = ''
      for (let i = 0; i < this.menuList.length; i++) {
        const element = this.menuList[i]
        target = walk(element)
        if (target) {
          this.$emit('on-select', target)
          return
        }
      }
      function walk (element) {
        if (element.path === name) {
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
.title
  font-size 20px
  color white
  text-align center
  line-height 49px
  padding 0
  margin 0
.menu-collapsed
  .drop-menu-a
    padding 6px 15px
    display inline-block
.icon-logo-zjy
  font-size 24px
.icon-logo-1
  font-size 32px
.icon
  display inline-block
  // vertical-align middle
</style>
