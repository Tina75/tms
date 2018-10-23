<template>
  <div :class="{'money-input-component-short': suffix}" class="money-input-component">
    <InputNumber v-model="money" :min="0"
                 :placeholder="placeholder"
                 @on-change="changeHandler"
                 @on-blur="blurHandler" />

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
    return { money: (this.value !== null && this.value !== '' && !isNaN(Number(this.value))) ? Number(this.value) : null }
  },
  watch: {
    value (value) {
      this.money = (value !== null && value !== '' && !isNaN(Number(value))) ? Number(value) : null
    }
  },
  methods: {
    changeHandler (value) {
      if (!value) return
      if (value && value.toString().split('.')[0].length > 9) {
        this.money = (this.value !== null && this.value !== '' && !isNaN(Number(this.value))) ? Number(this.value) : null
        this.$Message.error('金额整数部分不能超过9位')
      }
    },

    blurHandler () {
      if (typeof this.money === 'number') this.money = Number(this.money.toFixed(2))
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

    ::-webkit-input-placeholder
      color #c5c8ce
      font-size 12px
    :-moz-placeholder
      color #c5c8ce
      font-size 12px
    ::-moz-placeholder
      color #c5c8ce
      font-size 12px
    :-ms-input-placeholder
      color #c5c8ce
      font-size 12px

    .ivu-input-number-handler-wrap
      display none

    .ivu-input-number
      width 100% !important

    .number-input-unit
      position absolute
      right 10px
      top 5px
      height 32px
      line-height 32px
      font-size 12px
      color #999999

  .money-input-component-short .ivu-input-number-input
    width calc(100% - 20px)

</style>
