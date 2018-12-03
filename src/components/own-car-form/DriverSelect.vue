<template>
  <Select ref="$select" :value="currentValue" not-found-text="暂无此人，请新增司机" @on-change="handleChange">
    <Option v-for="(opt, index) in data" :key="index" :label="opt.value" :value="opt.value">
      {{opt.name}}
      <span class="select-driver__option">{{opt.driverPhone}}</span>
    </Option>
    <Option key="extra" value="extra" class="select-driver__extra-option" disabled>
      <span class="select-driver__text" @click.prevent="handleClick">
        <Icon type="ios-add" size="20" class="select-driver__icon"></Icon>
        新增司机
      </span>
    </Option>
  </Select>
</template>

<script>
/**
 * 司机选择框
 */
export default {
  name: 'driver-select',
  components: {
  },
  props: {
    value: String,
    data: {
      type: Array,
      default: () => []
    },
    onClick: Function
  },
  data () {
    return {
      currentValue: this.value || ''
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('on-click', e)
      this.$refs.$select.hideMenu()
    },
    handleChange (value) {
      if (value === 'extra') {
        // this.currentValue = ''
        // this.$emit('input', '')
        return
      }
      this.currentValue = value
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="stylus" scoped>
.select-driver
  &__option
    color #999999
    margin-left 10px
  &__extra-option
    text-align center
    border-top 1px solid #f8f8f8
    padding 0
    cursor pointer
  &__text
    display block
    padding 7px 16px 5px
    color #00A4BD
    font-size 12px
  &__icon
    top: -1px;
    position: relative;
</style>
