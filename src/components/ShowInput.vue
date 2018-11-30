<template>
  <i-input v-model="message" :style="'width:' + width + 'px'" disabled class="share-link">
    <span slot="prepend">{{ prepend }}</span>
  </i-input>
</template>
<script>
export default {
  props: {
    message: {
      type: String
    },
    prepend: {
      type: String
    },
    width: {
      type: [Number, String],
      default: 200
    }
  }
}
</script>

<style lang='stylus' scoped>
</style>
<style lang='stylus'>
  .share-link
    .ivu-input
      color #333
      background-color #F8F8F9
      border-left 0
      cursor text
    .ivu-input-group-prepend
      color #999
      padding 4px 0 4px 10px
</style>
