<template>
  <div class="sider">
    <Sider :collapsed-width="50" v-model="collapsed" breakpoint="md" collapsible style="height:100%">
      <side-menu :collapsed="collapsed" :active-name="$route.path" @on-select="onMenuSelect"/>
      <div slot="trigger" >
        <span :class="['sider-trigger', collapsed ? 'collapsed' : 'uncollapsed']" @click="collapsed = !collapsed">
          <i :class="[collapsed ? 'collapsed' : '']" class="icon font_family icon-ico-zz1"></i>
        </span>
      </div>
    </Sider>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import SideMenu from './SideMenu'
import { mapMutations, mapGetters } from 'vuex'
import { getNewTagList } from '@/libs/js/util'
export default {
  components: { SideMenu },
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
  &-trigger
    z-index 11
    top 45%
    position: absolute;
    right: -12px;
    text-align: center;
    height: 55px;
    line-height: 42px;
    color: #252A2F;
    cursor: pointer;
    -webkit-transition: background .3s ease;
    transition: background .3s ease;
    width:0;
    border-left:12px solid #C1C6CB;
    border-top:7px solid transparent;
    border-bottom:7px solid transparent;
    i
      position absolute
      right -1px
      font-size 14px
      transform rotate(180deg)
  .collapsed
    i
      transform rotate(0deg)

</style>
