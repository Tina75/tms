<template>
  <div :class="['item-container',checked?'mh-10':'']">
    <i v-show="checked" class="icon font_family icon-you2 icon-left" style=""></i>
    <div :class="['tab-item',checked?'tab-item__checked':'']">
      <Icon  v-show="checked" class="tab-item__icon " type="ios-refresh" size="20" @click.stop="$emit('on-refresh')"/>
      <span class="tab-item__name">{{ name}}</span>
      <Icon v-show="closeable" class="tab-item__icon" type="ios-close" size="20" @click.stop="$emit('on-close')"/>
    </div>
    <i v-show="checked" class="icon font_family icon-you2 icon-right" ></i>
  </div>
</template>

<script>
import BaseComponent from '@/basic/BaseComponent'
export default {
  name: 'TabNavItem',
  mixins: [ BaseComponent ],
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    name: String
  },
  computed: {
    closeable: function () {
      return this.checked && this.name !== '首页'
    }
  },
  methods: {
    close () {
      this.$emit('on-close')
    },
    refresh () {
      this.$emit('on-refresh')
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
.icon-left
  color #EFEFEF
  position:absolute;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
  left -3px
  font-size 10px
  bottom -11px
.icon-right
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

  &__icon
    display inline-block
    vertical-align middle
    font-size 12px
    transition 0.5s
    &:hover
      transform rotate(180deg)
  &__name
    max-width 60px
    line-height 1
    text-align center
    vertical-align middle
    display inline-block
    overflow hidden
    white-space nowrap
    margin 0 4px
    text-overflow ellipsis
  &__checked
    background #EFEFEF
    color #00A4BD
    border-sizing content-box
    border-bottom 1px solid #efefef
</style>
