<template>
  <div class="sider">
    <Sider :collapsed-width="50" v-model="collapsed" breakpoint="md" collapsible style="overflow:hidden;height:100%">
      <side-bar :collapsed="collapsed" :active-name="$route.path" @on-select="onMenuSelect"/>
      <div slot="trigger"></div>
    </Sider>
    <a :class="['sider-trigger-a', collapsed ? 'collapsed' : 'uncollapsed']"  type="text" @click="collapsed = !collapsed">
      <i class="icon font_family icon-ico-zz1"></i>
    </a>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import SideBar from './SideBar'
import { mapMutations, mapGetters } from 'vuex'
import { getNewTagList } from '@/libs/js/util'
export default {
  components: { SideBar },
  mixins: [ BaseComponent ],
  data () {
    return {
      collapsed: false
    }
  },

  computed: {
    ...mapGetters(['TabNavList'])
  },

  mounted () {
    window.EMA.bind('openTab', (route) => { this.onMenuSelect(route) })
    // 默认打开首页
    this.openHomeTab()
  },

  methods: {
    ...mapMutations(['setTabNavList']),
    openHomeTab () {
      const home = { path: '/home', params: { name: 'home' }, query: { title: '首页' } }
      this.onMenuSelect(home)
    },
    /**
     * @description 切换菜单
     * @param {*} menuItem 被选中的菜单对象
     */
    onMenuSelect (menuItem) {
      console.log('1.', JSON.stringify(menuItem))
      this.setTabNavList(getNewTagList(this.TabNavList, menuItem, this.$route))
      this.turnToPage(menuItem)
    },
    /**
     * @description 切换tab标签
     * @param {*} route 跳转目标的path或route对象
     */
    turnToPage  (route) {
      let { path, params, query, meta } = {}
      if (typeof route === 'string') path = route
      else {
        path = route.path
        params = route.params
        query = route.query
        meta = route.meta
      }
      this.$router.push({ path, params, query, meta })
    }

  }
}

</script>
<style lang='stylus'>
.sider
  height 100%
</style>
