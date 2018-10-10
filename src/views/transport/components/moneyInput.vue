<template>
  <div style="display: inline-block;">
    <Input v-model="money"
           :placeholder="placeholder"
           @on-blur="moneyFormatter">
    <span v-if="suffix"
          slot="suffix"
          class="number-input-unit">元</span>
    </Input>
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
    return { money: Number(this.value) ? Number(this.value).toFixed(2) : '' }
  },
  watch: {
    value (val) {
      this.money = Number(val) ? Number(val).toFixed(2) : ''
    }
  },
  methods: {
    moneyFormatter () {
      if (isNaN(Number(this.money)) || Number(this.money) < 0) {
        this.money = Number(this.value) ? Number(this.value).toFixed(2) : ''
        this.$Message.error('请输入正确的金额')
      } else if (!Number(this.money)) {
        this.money = ''
      } else {
        this.money = Number(this.money).toFixed(2)
      }
      this.$emit('input', this.money)
      this.$emit('on-blur', this.money)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .number-input-unit
    font-size 11px
    line-height 32px
    color #999999
</style>
