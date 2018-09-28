<template>
  <div class="ivu-card ivu-card-bordered">
    <div class="ivu-card-head tms-home__blank-header">
      <slot name="title">
        <span>{{title}}</span>
      </slot>
    </div>
    <div class="ivu-card-extra tms-home__blank-extra" @click.native="push(to)">
      <slot name="extra">
      </slot>
    </div>
    <div :class="cardBodyClass">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    to: String,
    title: String,
    padding: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    cardBodyClass () {
      return [
        'ivu-card-body',
        'tms-home__blank-body',
        this.padding ? '' : 'tms-home__no-padding'
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
.tms-home
  &__blank-header
    border-bottom none
  &__blank-extra
    cursor pointer
  &__blank-body
    height 234px
    padding 0 16px
  &__no-padding
    padding-left 0
    padding-right 0
.echarts
  width 100%
  height 234px
</style>
