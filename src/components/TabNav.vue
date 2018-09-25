<template>
  <div class="tags-nav">
    <!-- <div class="close-con">
      <Dropdown transfer  @on-click="handleTagsOption">
        <i-button size="small" type="text">
          <Icon :size="18" type="ios-close-circle-outline"/>
        </i-button>
        <DropdownMenu slot="list">
          <DropdownItem name="close-all">关闭所有</DropdownItem>
          <DropdownItem name="close-others">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div> -->
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
            v-for="(item,index) in list"
            ref="tagsPageOpened"
            :key="`tag-nav-${index}`"
            :name="item.name"
            :checked="item.query?item.query.id===value.query.id:item.path === value.path"
            @on-close="handleClose(item)"
            @on-refresh="handleRefresh(item)"
            @click.native="handleClick(item)">
          </tab-nav-item>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
import TabNavItem from '@/components/TabNavItem'
export default {
  name: 'TabNav',
  components: { TabNavItem },
  mixins: [BaseComponent],
  props: {
    value: Object,
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      tagBodyLeft: 0,
      currItem: {}
    }
  },
  computed: {
    isTabChecked: {
      set (item) {
        this.currItem = item
      },
      get () {
        if (this.currItem.query) {
          return this.currItem.path === this.value.path && this.currItem.query.id === this.value.query.id
        } else {
          return this.currItem.path === this.value.path
        }
      }
    }
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
    // handleTagsOption (type) {
    //   if (type === 'close-all') {
    //     // 关闭所有，除了home
    //     let res = this.list.filter(item => item.path === '/home')
    //     // this.$emit('on-close', res, 'all')
    //     this.$store.commit('updateTabList', res)
    //   } else {
    //     // 关闭除当前页和home页的其他页
    //     let res = this.list.filter(item => item.path === this.value.path || item.name === '/home')
    //     // this.$emit('on-close', res, 'others')
    //     this.$store.commit('updateTabList', res)
    //   }
    // },
    handleClose (item) {
      let res = this.list.filter(element => element.name !== item.name)
      this.$emit('on-close', res, item)
    },
    handleRefresh (item) {
      this.ema.fire('reloadTab', {...item})
    },
    handleClick (item) {
      this.$emit('on-select', item)
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
      height calc(100% - 1px)
      display inline-block
      // padding 1px 4px 0
      position absolute
      overflow visible
      white-space nowrap
      transition left .3s ease
      .ivu-tag-dot-inner
        transition background .2s ease
</style>
