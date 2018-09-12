<template>
  <div>
    <Menu v-show="!collapsed" ref="menu"  :active-name="currTab.href" :open-names="openedNames"  accordion width="200" theme="dark" @on-select="handleSelect">
      <p class="title"><i class="icon font_family icon-logo-zjy" ></i></p>
      <template v-for="item in menuList">
        <template v-if="item.children">
          <Submenu :name="item.name" :key="item.href">
            <template slot="title"><Icon :type="item.icon" size="18"/>{{item.name}}</template>
            <menu-item v-for="child in item.children" :name="child.href" :key="child.name" :to="child.href">{{child.name}}</menu-item>
          </Submenu>
        </template>
        <template v-else>
          <menu-item :name="item.href" :to="item.href" :key="item.href"><Icon :type="item.icon" size="18"/>{{item.name}}</menu-item>
        </template>
      </template>
    </Menu>
    <div v-show="collapsed" class="menu-collapsed">
      <p class="title"><i class="icon font_family icon-logo-1"></i></p>
      <template v-for="item in menuList" >
        <div :key="item.name" >
          <Poptip v-if="item.children" trigger="hover"  placement="left-start">
            <div v-for="child in item.children" slot="content" :key="child.href" @click="handleSelect(child.href)">
              <menu-item :name="child.href" :to="child.href" :key="child.href" >{{child.name}}</menu-item>
            </div>
            <a class="drop-menu-a" href=""><Icon :type="item.icon" color="#fff" size="22"/></a>
          </Poptip>
          <a v-else :href="item.href" class="drop-menu-a"><Icon :type="item.icon" color="#fff" size="22"/></a>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import menu from '@/assets/menu.json'
import {mapGetters} from 'vuex'
export default {
  props: {
    collapsed: Boolean
  },
  data () {
    return {
      menuList: menu,
      openedNames: []
    }
  },
  computed: {
    ...mapGetters(['currTab'])
  },
  watch: {
    currTab: function (val) {
      this.getopenedNames(val.name)
    }
  },
  mounted () {
  },
  methods: {
    getopenedNames (activeName) {
      if (activeName) {
        let openItem = getParent(this.menuList)
        if (openItem && openItem.name) {
          this.openedNames = []
          this.openedNames.push(openItem.name)
        }
        this.$nextTick(() => {
          this.$refs.menu.updateOpened()
        })
      }
      function getParent (element = []) {
        return element.find(item => {
          return item.name === activeName || getParent(item.children)
        })
      }
    },
    handleSelect (name) {
      let target = ''
      for (let i = 0; i < this.menuList.length; i++) {
        const element = this.menuList[i]
        target = walk(element)
        if (target) {
          this.$store.commit('changeTab', target)
          return
        }
      }
      function walk (element) {
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
      this.$emit('on-select', name)
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
  font-size 21px
.icon-logo-1
  font-size 32px
</style>
