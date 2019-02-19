<template>
  <div :class="orderForm ? 'form-order' : 'ordre-create__title'">
    <slot></slot>
  </div>
</template>

<script>
// 区分表单模板
export default {
  props: {
    orderForm: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="stylus" scoped>
.ordre-create
  &__title
    background-color #00A4BD
    padding 7px 0 7px 21px
    font-size 14px
    color #fff
.form-order
  background rgba(234,252,255,1)
  color #00A4BD
</style>
