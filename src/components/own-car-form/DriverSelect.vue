<template>
  <Select ref="$select" :transfer="true" :value="currentValue" not-found-text="暂无此人，请新增司机" clearable @on-change="handleChange">
    <Option v-for="(opt, index) in data" :key="index" :label="opt.value" :value="opt.value" :disabled="disabledOption(opt)">
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
  props: {
    value: String,
    data: {
      type: Array,
      default: () => []
    },
    isValidate: {
      type: Boolean,
      default: false
    },
    /**
     * 需要忽略的司机名列表，修改车辆的时候需要添加
     */
    filteredValidate: {
      type: Array,
      default: () => []
    },
    onClick: Function,
    onChange: Function
  },
  data () {
    return {
      currentValue: this.value || ''
    }
  },
  watch: {
    value (newValue) {
      if (newValue !== this.currentValue) {
        this.currentValue = newValue
        this.dispatch.call(this.$parent, 'FormItem', 'on-form-change', newValue)
      }
    }
  },
  methods: {
    /**
     * 校验选项
     * 是否可选，已经绑定其他车辆
     */
    disabledOption (item) {
      if (!this.isValidate) {
        return false
      }
      return item.type === 2 && !this.filteredValidate.includes(item.id)
    },
    handleClick (e) {
      this.$emit('on-click', e)
      this.$refs.$select.hideMenu()
    },
    handleChange (value) {
      if (value === 'extra') {
        return
      }
      this.currentValue = value
      this.$emit('input', value)
      this.$emit('on-change', value)
    },
    dispatch (componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent
        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
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
