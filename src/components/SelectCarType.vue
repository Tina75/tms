<template>
  <div class="selectCustomSty">
    <Dropdown trigger="click" transfer @on-click="handleSelect">
      <Input
        v-show="false"
        :value="formatterValue">
      </Input>
      <Input
        v-model="showValue"
        :placeholder="placeholder"
        :transfer="transfer"
        readonly unselectable="on"
        class="customSelectText"
        @click.native="showSelect = !showSelect"
        @on-blur="showSelect = true"
        @input.native="change"
        @mouseenter.native="mousehover = true"
        @mouseleave.native="mousehover = false">
      <Icon v-if="mousehover && isClearable" slot="suffix" type="ios-close-circle" class="select-clear-icon" @click.native.stop="handleClear"></Icon>
      <Icon v-if="(!mousehover || !isClearable) && showSelect" slot="suffix" type="ios-arrow-down" class="select-input-icondown"></Icon>
      <Icon v-if="(!mousehover || !isClearable) && !showSelect" slot="suffix" type="ios-arrow-up" class="select-input-iconup"></Icon>
      </Input>
      <DropdownMenu slot="list">
        <div class="selectListLabel">
          <span v-for="(item, key) in listMap" :key="key" :value="key" class="labelSpan">
            <DropdownItem :style="item.label === showValue ? 'color: #00a4bd' : ''" :name="item.label">
              {{item.label}}
            </DropdownItem>
          </span>
        </div>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
import { CAR_TYPE } from '@/libs/constant/carInfo'
import dispatchMixin from '@/components/mixins/dispatchMixin'
export default {
  name: 'SelectCarType',
  mixins: [dispatchMixin],
  props: {
    value: '',
    placeholder: '',
    clearable: {
      type: Boolean,
      default: false
    },
    maxlength: '',
    transfer: '',
    type: '', // type 默认【车型/车厂/包装方式】，如有自定义传入listMapData集合
    listMapData: Array, // 外部传入的Array格式，必须为{ value: '纸箱', label: '纸箱' }格式
    isText: false // 是否支持输入&选择
  },
  data () {
    return {
      visible: false,
      showSelect: true,
      showValue: '',
      currentValue: this.value,
      listMap: [],
      mousehover: false
    }
  },
  computed: {
    formatterValue () {
      return this.currentValue
    },
    notEmpty () {
      return typeof this.currentValue !== 'undefined' && String(this.currentValue).trim() !== ''
    },
    isClearable () {
      return this.notEmpty && this.clearable
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  },
  mounted () {
    this.listMap = CAR_TYPE
    if (this.currentValue) this.findItemData()
  },
  methods: {
    // 点击下拉框项
    handleSelect (name) {
      const item = this.listMap.find((opt) => {
        if (opt.label) {
          return opt.label === name
        }
        return opt.value === name
      })
      this.showValue = name
      this.setValue(item.value)
      this.visible = false
      // 选中某一项
      this.$emit('on-select', item.value, item)
    },
    findItemData () {
      let dataInit = this.listMap.find(item => item.value.toString() === this.currentValue.toString())
      if (!dataInit) {
        this.showValue = this.currentValue
      } else {
        this.showValue = dataInit.label
        return dataInit.label
      }
    },
    clickInput (event) {
      this.showSelect = !this.showSelect
      this.visible = !this.visible
    },
    change (event) {
      if (this.type === 'packageType' || this.isText) {
        this.setValue(event.target.value)
      }
      setTimeout(() => {
        this.visible = false
      }, 100)
    },
    setValue (val) {
      this.$nextTick(() => {
        this.currentValue = val
        this.$emit('input', val)
        this.dispatch.call(this.$parent, 'FormItem', 'on-form-change', val)
      })
    },
    clickItemLabel (item) {
      this.showValue = item.label
      this.showSelect = true
      this.visible = false
      this.setValue(item.value)
    },
    // 清空
    handleClear () {
      this.$emit('on-clear')
      // this.currentValue = ''
      this.showValue = ''
      // this.$emit('input', this.currentValue)
      this.setValue('')
    }
  }
}
</script>
<style lang="stylus" scoped>
>>>.customSelectText .ivu-input
  cursor pointer
>>>.ivu-dropdown
  width 100%
>>>.ivu-select-dropdown
  min-width 200px
.selectCustomSty
  width 100%
  display inline-block
.selectListLabel
  min-width 200px
  padding 0 15px
  .labelSpan
    display inline-block
    cursor pointer
    width 55px
  .labelSpan .ivu-dropdown-item:hover
    color #00A4BD
    // border #00A4BD 1px solid
    // width 55px
.select-input-icondown .select-input-iconup
  transform rotate(180deg)
  -moz-transform rotate(180deg)
  -webkit-transform rotate(180deg)
  transition transform 0.2s ease-in-out
</style>
