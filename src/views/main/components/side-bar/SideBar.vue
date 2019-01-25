<template>
  <div class="sider">
    <Sider :collapsed-width="50" v-model="collapsed" breakpoint="md" collapsible hide-trigger class="sider-layout">
      <side-menu :collapsed="collapsed" :active-name="$route.path" />
    </Sider>
    <div class="sider-trigger-el" >
      <span :class="['sider-trigger', collapsed ? 'collapsed' : 'uncollapsed']" @click="collapsed = !collapsed">
        <i :class="[collapsed ? 'collapsed' : '']" class="icon font_family icon-ico-zz1"></i>
      </span>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import SideMenu from './SideMenu'
import { mapGetters } from 'vuex'
// import { getNewTagList } from '@/libs/js/util'
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
    // window.EMA.bind('openTab', (route) => { this.onMenuSelect(route) })
    // 默认打开首页
    // this.openHomeTab()
  },

  methods: {
    // ...mapMutations(['setTabNavList']),
    // openHomeTab () {
    //   const home = { path: '/home', params: { name: 'home' }, query: { title: '首页' } }
    //   this.onMenuSelect(home)
    // }
  }
}

</script>
<style lang='stylus' scoped>
.sider
  height 100%
  &-layout
    height 100%
    overflow hidden
  &-trigger-el
    position: absolute;
    top: 45%;
    left: 0;
    z-index: 999;
  &-trigger
    z-index 11
    top 0
    left 200px
    position: absolute;
    text-align: center;
    height: 55px;
    line-height: 42px;
    color: #252A2F;
    cursor: pointer;
    -webkit-transition: left .3s ease;
    transition: left .3s ease;
    width:0;
    border-left:12px solid #C1C6CB;
    border-top:7px solid transparent;
    border-bottom:7px solid transparent;
    >>> i
      position absolute
      right -1px
      font-size 14px
      transform rotate(180deg)
  >>> .collapsed
    i
      transform rotate(0deg)
  &-trigger.collapsed
    left 50px
</style>
