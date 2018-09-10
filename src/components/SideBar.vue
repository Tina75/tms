<template>
  <div>
    <p class="title">TMS</p>
    <Menu v-show="!collapsed"  width="200"  theme="dark" active-name="1-1" @on-select="handleSelect">
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
      <template v-for="item in menuList" >
        <div :key="item.name" >
          <Poptip v-if="item.children" trigger="hover"  placement="left-start">
            <div v-for="child in item.children" slot="content" :key="child.href" @click="handleSelect(child.href)">
              <!-- <p><a :href="child.href" @click="handleSelect(child.href)">{{child.name}}</a></p> -->
              <menu-item :name="child.href" :to="child.href" :key="child.href" >{{child.name}}</menu-item>
            </div>
            <a class="drop-menu-a" href=""><Icon :type="item.icon" color="#fff" size="22"/></a>
          </Poptip>
          <a v-else class="drop-menu-a"><Icon :type="item.icon" color="#fff" size="22"/></a>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import menu from '@/assets/menu.json'
export default {
  props: {
    collapsed: Boolean
  },
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
.menu-collapsed
  .drop-menu-a
    padding 6px 15px
    display inline-block
</style>
