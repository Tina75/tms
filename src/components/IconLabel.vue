<template>
  <span :style="'background:' + background + ';color:' + color">{{ text }}</span>
</template>
<script>
export default {
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    },
    color: {
      type: String,
      default: '#fff'
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
