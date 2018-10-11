<template>
  <div :class="{'money-input-component-short': suffix}" class="money-input-component">
    <InputNumber v-model="money" :min="0"
                 :placeholder="placeholder"
                 @on-blur="handlerBlur" />

    <span v-if="suffix"
          class="number-input-unit">元</span>
  </div>
</template>

<script>
export default {
  name: 'MoneyInput',
  props: {
    value: [ Number, String ],
    placeholder: String,
    suffix: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return { money: Number(this.value) ? Number(this.value) : null }
  },
  watch: {
    value (val) {
      this.money = Number(val) ? Number(val) : null
    }
  },
  methods: {
    // moneyFormatter (val) {
    //   val = val.toString()
    //   if (val.split('.')[1] && val.split('.')[1].length > 2) return Number(val).toFixed(2)
    //   return val
    // },

    // parser (val) {
    //   console.log(val)
    //   return Number(val).toFixed(2)
    // },

    handlerBlur () {
      this.money = Number(this.money.toFixed(2))
      this.$emit('input', this.money)
      this.$emit('on-blur', this.money)
    }
  }
}
</script>

<style lang="stylus">
  .money-input-component
    position relative
    display: inline-block;

    .ivu-input-number-handler-wrap
      display none

    .ivu-input-number
      width 100% !important

    .number-input-unit
      position absolute
      right 10px
      top 5px
      font-size 11px
      color #999999

  .money-input-component-short .ivu-input-number-input
    width calc(100% - 20px)

</style>
