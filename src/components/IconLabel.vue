<template>
  <span :style="'background:' + background">{{ text }}</span>
</template>
<script>
export default {
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  }
}
</script>

<style lang="stylus" scoped>
  span
    display inline-block
    width 14px
    height 14px
    border-radius 2px
    color #fff
    line-height 14px
    text-align center
    margin-right 5px
    font-size 11px
</style>
