<template>
  <div class="selectCustomSty">
    <Poptip v-model="visible" :width="width" placement="bottom" transfer popper-class="package-poptip">
      <Input
        v-show="false"
        :value="formatterValue">
      </Input>
      <Input
        ref="input"
        v-model="showValue"
        :placeholder="placeholder"
        :transfer="transfer"
        :maxlength="maxlength"
        @click.native="clickInput"
        @on-blur="showSelect = true; visible = false"
        @input.native="change"
        @mouseenter.native="mousehover = true"
        @mouseleave.native="mousehover = false">
      <Icon v-if="mousehover && isClearable" slot="suffix" type="ios-close-circle" class="select-clear-icon" @click.native.stop="handleClear"></Icon>
      <Icon v-if="false" slot="suffix" type="ios-arrow-down" class="select-input-icondown"></Icon>
      <!-- <Icon v-if="(!mousehover || !isClearable) && !showSelect" slot="suffix" type="ios-arrow-up" class="select-input-iconup"></Icon> -->
      </Input>
      <div slot="content" class="selectListLabel">
        <Row type="flex">
          <div v-for="(item, key) in listMap" :key="key" :value="key" :class="['labelSpan',item.label === showValue ? 'active':'']" @click="handleSelect(item.label)">
            {{item.label}}
          </div>
        </Row>
      </div>
    </Poptip>
  </div>
</template>
<script>
import { PACKAGE_TYPE } from '@/libs/constant/carInfo'
import dispatchMixin from '@/components/mixins/dispatchMixin'
export default {
  name: 'SelectPackageType',
  mixins: [dispatchMixin],
  props: {
    value: '',
    placeholder: '',
    clearable: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: [String, Number],
      default: 10
    },
    transfer: '',
    type: '', // type 默认【车型/车厂/包装方式】，如有自定义传入listMapData集合
    listMapData: Array // 外部传入的Array格式，必须为{ value: '纸箱', label: '纸箱' }格式
  },
  data () {
    return {
      width: '250',
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
      if (this.currentValue !== val) {
        this.currentValue = val
        this.findItemData()
      }
    }
  },
  created () {
    if (this.listMapData) this.listMap = this.listMapData
  },
  mounted () {
    this.listMap = PACKAGE_TYPE
    if (this.currentValue) this.findItemData()
    this.$nextTick(() => {
      let rect = this.$refs.input.$refs.input.getBoundingClientRect()
      if (rect.width > 250) {
        this.width = rect.width
      }
    })
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
      if (this.currentValue) {
        let dataInit = this.listMap.find(item => item.value.toString() === this.currentValue.toString())
        if (!dataInit) {
          this.showValue = this.currentValue
        } else {
          this.showValue = dataInit.label
          return dataInit.label
        }
      } else {
        this.showValue = ''
      }
    },
    clickInput (event) {
      this.showSelect = !this.showSelect
      this.visible = !this.visible
    },
    change (event) {
      this.setValue(event.target.value)
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
>>> .ivu-poptip
      display block
      .ivu-poptip-rel
        display block
.selectCustomSty
  width 100%
  display inline-block
.selectListLabel
  .labelSpan
    cursor pointer
    text-align center
    float left
    width 60px
    border 1px solid #EEEFF1
    margin-left 17px
    margin-top 8px
    border-radius 4px
  .labelSpan .ivu-dropdown-item:hover
    color #00A4BD
  .labelSpan.active
    color #00a4bd
    border-color #00a4bd
  .labelSpan:hover
    color #00a4bd
    border-color #00a4bd
.selectListLabel:after
  content  ''
  clear both
  display table
  zoom 1
.select-input-icondown .select-input-iconup
  transform rotate(180deg)
  -moz-transform rotate(180deg)
  -webkit-transform rotate(180deg)
  transition transform 0.2s ease-in-out
</style>
<style lang="stylus">
.package-poptip
  .ivu-poptip-content
    margin-top -7px
    .ivu-poptip-arrow
      display none
    .ivu-poptip-body
      padding 15px 0px 23px
    .ivu-poptip-body-content
      overflow hidden
</style>
