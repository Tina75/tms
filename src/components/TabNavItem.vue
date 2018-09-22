<template>
  <div :class="['tab-item',checked?'tab-item__checked':'']">
    <!-- <i  v-show="checked" class="icon font_family icon-shuaxin tab-item__icon i-mr-5" @click.stop="$emit('on-refresh')"></i> -->
    <Icon  v-show="checked" class="tab-item__icon " type="ios-refresh" size="18" @click.stop="$emit('on-refresh')"/>
    <span class="tab-item__name">{{name}}</span>
    <Icon v-show="closeable" class="tab-item__icon" type="ios-close" size="18" @click.stop="$emit('on-close')"/>
    <!-- <i  v-show="closeable" class="icon font_family icon-shanchu tab-item__icon i-pl-5" @click.stop="close"></i> -->
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
.tab-item
  display inline-block
  color #EFEFEF
  max-width 120px
  min-width 80px
  line-height 30px
  margin-right 6px
  padding 0 2px 0 5px
  height 30px
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
    shape-outside circle()
</style>
