<template>
  <div class="tags-nav">
    <div class="btn-con left-btn">
      <i-button icon="ios-arrow-back" type="text" @click="handleScroll(240)"/>
    </div>
    <div class="btn-con right-btn">
      <i-button icon="ios-arrow-forward" type="text" @click="handleScroll(-240)"/>
    </div>
    <div ref="scrollOuter" class="scroll-outer" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
      <div ref="scrollBody" :style="{left: tagBodyLeft + 'px'}" class="scroll-body">
        <transition-group name="taglist-moving-animation">
          <tab-nav-item
            v-for="(item,index) in NavTabList"
            ref="tagsPageOpened"
            :key="`tag-nav-${index}`"
            :tab="item"
          >
          </tab-nav-item>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import TabNavItem from './TabNavItem'
import { mapGetters } from 'vuex'
import navTabManager from '../util/NavTabManager'
export default {
  name: 'TabNav',
  components: { TabNavItem },
  mixins: [BaseComponent],
  props: {
    value: Object
  },
  data () {
    return {
      tagBodyLeft: 0,
      currItem: {}
    }
  },
  computed: {
    ...mapGetters(['NavTabList'])
  },
  watch: {
    $route (to) {
      navTabManager.addNavTab(to)
      setTimeout(() => {
        if ((document.querySelector('.item-container.mh-10').offsetLeft + document.querySelector('.item-container.mh-10').clientWidth) < document.querySelector('.scroll-outer').clientWidth) {
          this.tagBodyLeft = 0
        } else {
          this.tagBodyLeft = document.querySelector('.scroll-outer').clientWidth - (document.querySelector('.item-container.mh-10').offsetLeft + document.querySelector('.item-container.mh-10').clientWidth)
        }
      }, 50)
    }
    // 'value.query.title' () {

    // }
  },
  mounted () {
    navTabManager.addNavTab(this.$route)
    window.EMA.bind('openTab', (route) => { this.handleClick(route) })
    // 页面内部，主动调用关闭本页函数，监听函数；
    window.EMA.bind('closeTab', (route) => { this.handleClose(route) })
  },
  methods: {
    handlescroll (e) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
      }
      this.handleScroll(delta)
    },
    handleScroll (offset) {
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset)
      } else {
        if (this.$refs.scrollOuter.offsetWidth < this.$refs.scrollBody.offsetWidth) {
          if (this.tagBodyLeft < -(this.$refs.scrollBody.offsetWidth - this.$refs.scrollOuter.offsetWidth)) {
            this.tagBodyLeft = this.tagBodyLeft
          } else {
            this.tagBodyLeft = Math.max(this.tagBodyLeft + offset, this.$refs.scrollOuter.offsetWidth - this.$refs.scrollBody.offsetWidth)
          }
        } else {
          this.tagBodyLeft = 0
        }
      }
    },
    /**
     * 关闭标签
     */
    handleClose (route) {
      // this.$parent.onTabClose(route)
      window.EMA.fire('on-close', route)

      let tab = this.NavTabList.find((item) => item.path === route.path)
      if (tab) {
        let nextRoute = tab.close()
        if (nextRoute) {
          this.$router.push(nextRoute)
        }
      }
    },
    // handleRefresh (item) {
    //   this.ema.fire('reloadTab', { ...item })
    // },
    /**
     * 打开未知的tab
     * 1. 可能已有
     * 2. 可能没有
     * {
    *     path: TMSUrl.CARRIER_MANAGEMENT_CAEDETAILS,
     *    query: {
     *       id: '车辆详情',
     *       rowData: params.row
     *     }
     *   }
     * @param {object} item
     */
    handleClick (item) {
      // this.$emit('on-select', item)
      let { path, query, params = {} } = item
      this.$router.push({ path, params, query, meta: { title: item.query.title } })
    }
  }
}
</script>

<style lang="stylus">
.no-select
  -webkit-touch-callout none
  -webkit-user-select none
  -khtml-user-select none
  -moz-user-select none
  -ms-user-select none
  user-select none
.tags-nav
  position relative
  // border-top 1px solid #F0F0F0
  // border-bottom 1px solid #F0F0F0
  height 100%
  .no-select
  .size
  .close-con
    position absolute
    right 0
    top 0
    height 100%
    width 32px
    background #fff
    text-align center
    z-index 10
  .btn-con
    position absolute
    top 0
    bottom 0
    height 100%
    z-index 10
    display inline-block
    button
      padding 6px 4px
      line-height 14px
      text-align center
      font-size 14px
    &.left-btn
      left 0px
      background #252A2F
      border-left 1px solid #3A424B
    &.right-btn
      // right 32px
      right 0px
      background #252A2F
      border-right 1px solid #3A424B
  .scroll-outer
    position absolute
    left 23px
    // right 56px
    right 24px
    top 6px
    bottom 0
    // box-shadow 0px 0 3px 2px rgba(100,100,100,.1) inset
    .scroll-body
      // height calc(100% - 1px)
      height 100%
      display inline-block
      // padding 1px 4px 0
      position absolute
      overflow visible
      white-space nowrap
      transition left .3s ease
      .ivu-tag-dot-inner
        transition background .2s ease
</style>
