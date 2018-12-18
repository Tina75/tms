<template>
  <div :class="['item-container',checked?'mh-10':'']">
    <i v-show="checked" class="icon font_family icon-you2 border-icon-left" style=""></i>
    <div :class="['tab-item',checked?'tab-item__checked':'']">
      <span style="display:inline-block;min-width:18px">
        <Icon v-show="checked" class="tab-item__icon " type="ios-refresh" size="20" @click.stop="refresh"/>
      </span>
      <span class="tab-item__name"><router-link :to="path">{{name}}</router-link></span>
      <span style="display:inline-block;min-width:18px">
        <Icon v-show="closeable" :style="checked?'visibility:visible':'visibility:hidden'" class="tab-item__icon close-icon" type="ios-close" size="20" @click.stop="close"/>
      </span>
    </div>
    <i v-show="checked" class="icon font_family icon-you2 border-icon-right" ></i>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
export default {
  name: 'TabNavItem',
  mixins: [ BaseComponent ],
  props: {
    tab: {
      type: Object,
      required: true
    }
  },
  computed: {
    checked () {
      return this.tab.isActive
    },
    name () {
      return this.tab.title
    },
    path () {
      return {
        path: this.tab.path,
        query: {
          title: this.tab.title,
          ...this.tab.query
        }
      }
    },
    closeable: function () {
      return this.name !== '首页'
    }
  },
  mounted () {
    this.ema = window.EMA.getProxy()
  },
  methods: {
    close () {
      let nextRoute = this.tab.close()
      this.ema.fire('closeTab', this.tab)
      if (nextRoute) {
        this.$router.push(nextRoute)
      }
    },
    refresh () {
      // this.$emit('on-refresh')
      let tab = this.tab
      this.tab.refresh()
      this.close()
      this.$nextTick(() => {
        this.$router.push(tab)
      })
    }
  }
}

</script>
<style lang='stylus' scoped>
.item-container
  display inline-block
  position relative
  padding-right 3px
  padding-left 3px
.mh-10
  padding 0 5px
.border-icon-left
  color #EFEFEF
  position:absolute;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
  left -3px
  font-size 10px
  bottom -11px
.border-icon-right
  color #EFEFEF
  position absolute
  right -3px
  font-size 10px
  bottom -11px
.tab-item
  display inline-block
  color #EFEFEF
  max-width 120px
  min-width 80px
  line-height 32px
  // margin-right 6px
  padding 0
  height 32px
  border-radius 8px 8px 0px 0px
  background #3A424B
  cursor pointer
  font-weight 500
  text-align center
  &:hover .close-icon
    visibility visible !important
  &__icon
    display inline-block
    vertical-align middle
    font-size 12px
    transition 0.5s
    &:hover
      transform rotate(180deg)
  &__name
    max-width 70px
    font-size 13px
    text-align center
    vertical-align middle
    display inline-block
    overflow hidden
    white-space nowrap
    // margin 0 4px
    text-overflow ellipsis
    a
      color #fff
  &__checked
    background #EFEFEF
    color #00A4BD
    border-sizing content-box
    border-bottom 1px solid #efefef
    .tab-item__name
      a
        color #00a4bd
</style>
