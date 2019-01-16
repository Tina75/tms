<template>
  <ExtraSelect ref="$select" :transfer="true" :value="currentValue" not-found-text="暂无此人，请新增司机" filterable clearable @on-change="handleChange">
    <Option v-for="(opt, index) in data" :key="'normal-'+index" :label="opt.value" :value="opt.value" :title="opt.name" :disabled="disabledOption(opt)">
      <span class="select-driver__option-name">{{opt.name}}</span>
      <span class="select-driver__option">{{opt.driverPhone}}</span>
      <span  :class="['i-ml-10',opt.driverStatus === 1 ? 'i-status-warning':'i-status-info']">
        {{driverStatus(opt.driverStatus)}}
      </span>
    </Option>
    <Option v-for="(opt, index) in extraOptions" :key="'disabled-'+index" :label="opt.value" :value="opt.value" disabled>
      {{opt.name}}
      <span class="select-driver__option">{{opt.driverPhone}}</span>
    </Option>
    <Option key="extra" value="extra" class="select-driver__extra-option" disabled>
      <span class="select-driver__text" @click.prevent="handleClick">
        <Icon type="ios-add" size="20" class="select-driver__icon"></Icon>
        新增司机
      </span>
    </Option>
  </ExtraSelect>
</template>

<script>
/**
 * 司机选择框
 */
import ExtraSelect from './ExtraSelect.vue'
import dispatchMixin from '../mixins/dispatchMixin.js'
import { DRIVER_STATUS } from '@/libs/constant/carInfo'
export default {
  name: 'driver-select',
  components: {
    ExtraSelect
  },
  mixins: [dispatchMixin],
  props: {
    value: String,
    data: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Array,
      default: () => []
    },
    isValidate: {
      type: Boolean,
      default: false
    },
    // 额外的options，disabled，已删除的数据
    extraOptions: {
      type: Array,
      default: () => []
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
      /**
       * 车牌选择后，需触发验证
       */
      if (newValue !== this.currentValue) {
        this.currentValue = newValue
        this.dispatch.call(this.$parent, 'FormItem', 'on-form-change', newValue)
      }
    }
  },
  methods: {
    driverStatus (status) {
      return DRIVER_STATUS[status]
    },
    /**
     * 校验选项
     * 1.主副司机互斥， 修改车辆的时候信息是：{id,name} ，修改运单场景都是：{name,phone}
     * 2.是否可选，已经绑定其他车辆
     */
    disabledOption (item) {
      // 主副司机互斥
      if (this.disabled.includes(item.name)) {
        return true
      }
      if (!this.isValidate) {
        return false
      }
      // 绑定其他车辆
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
    /**
     * 搜索后，在新增，导致下拉框没有选项的bug
     */
    clearQuery () {
      this.$refs.$select.query = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
.select-driver
  &__option
    color #999999
    margin-left 10px
    display inline-block
    overflow hidden
  &__option-name
    display inline-block
    width 48px
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
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
    position: relative
</style>
<style lang="stylus">
.ivu-select-item-disabled
  .select-driver__option
    color #c5c8ce
</style>
