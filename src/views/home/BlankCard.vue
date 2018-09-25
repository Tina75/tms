<template>
  <div class="ivu-card ivu-card-bordered">
    <div class="ivu-card-head tms-home__blank-header">
      <slot name="title">
        <span>{{title}}</span>
      </slot>
    </div>
    <div class="ivu-card-extra">
      <slot name="extra">
      </slot>
    </div>
    <div class="ivu-card-body tms-home__blank-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>

<style lang="stylus" scoped>
.tms-home
  &__blank-header
    border-bottom none
  &__blank-body
    height 234px
    padding 0 16px
</style>
