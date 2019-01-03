<template>
  <div :class="wrapClasses">
    <div :class="inputWrapClasses">
      <span v-if="showSuffix" class="ivu-input-suffix">
        <slot name="suffix">
          <i v-if="suffix" :class="['ivu-icon-' + suffix]"  class="ivu-icon"></i>
        </slot>
      </span>
      <input
        :id="elementId"
        :class="inputClasses"
        :disabled="disabled"
        :autofocus="autofocus"
        :readonly="readonly || !editable"
        :name="name"
        :value="formatterValue"
        :placeholder="placeholder"
        autocomplete="off"
        spellcheck="false"
        @focus="focus"
        @blur="blur"
        @keydown.stop="keyDown"
        @input="change"
        @mouseup="preventDefault"
        @change="change">
    </div>
    <span v-if="showChinese" class="ivu-input-number-fee-chinese">
      {{transform2Chinese(currentValue)}}
    </span>
  </div>
</template>
<script>
import float from '../libs/js/float.js'
import { money2chinese } from '@/libs/js/util'
import dispatchMixin from './mixins/dispatchMixin.js'
const prefixCls = 'ivu-input-number'
export default {
  name: 'TagNumberInput',
  mixins: [dispatchMixin],
  props: {
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    step: {
      type: Number,
      default: 1
    },
    activeChange: {
      type: Boolean,
      default: true
    },
    value: {
      type: [Number, String],
      default: 1
    },
    size: {
      type: String,
      validator (value) {
        return ['small', 'large', 'default'].indexOf(value) !== -1
      },
      default () {
        return 'default'
      }
    },
    // 整数长度部分长度限制
    length: {
      type: [Number, String],
      default: 9
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    name: {
      type: String
    },
    // 小数点精度
    precision: {
      type: Number,
      default: 2
    },
    elementId: {
      type: String
    },
    formatter: {
      type: Function
    },
    parser: {
      type: Function
    },
    placeholder: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    // 显示中文提示，一万二千..，通常费用需要显示
    showChinese: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      focused: false,
      showSuffix: false,
      upDisabled: false,
      downDisabled: false,
      currentValue: this.value
    }
  },
  computed: {
    wrapClasses () {
      return [
        `${prefixCls}`,
        `${prefixCls}-w100`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-focused`]: this.focused
        }
      ]
    },
    inputWrapClasses () {
      return `${prefixCls}-input-wrap`
    },
    inputClasses () {
      return `${prefixCls}-input`
    },
    precisionValue () {
      // can not display 1.0
      if (!this.currentValue) return this.currentValue
      return float.floor(this.currentValue, this.precision)
    },
    formatterValue () {
      // if (this.formatter && this.precisionValue !== null) {
      //   return this.formatter(this.precisionValue.toString())
      // } else {
      //   return this.precisionValue
      // }
      if (this.formatter) {
        return this.formatter(this.currentValue.toString())
      } else {
        return this.currentValue
      }
    }
  },
  watch: {
    value (val) {
      // 不能设置null，如果加上null，用户第一个输入0就出现问题
      this.currentValue = val
    },
    currentValue (val) {
      this.changeVal(val)
    },
    min () {
      this.changeVal(this.currentValue)
    },
    max () {
      this.changeVal(this.currentValue)
    }
  },
  mounted () {
    this.changeVal(this.currentValue)

    this.showSuffix = this.suffix !== '' || this.$slots.suffix !== undefined
  },
  methods: {
    preventDefault (e) {
      e.preventDefault()
    },
    setValue (val) {
      // 如果 step 是小数，且没有设置 precision，是有问题的
      if (val && !isNaN(this.precision)) val = float.floor(val, this.precision)

      const { min, max } = this
      if (val !== null) {
        if (val > max) {
          val = max
        } else if (val < min) {
          val = min
        }
      }

      this.$nextTick(() => {
        this.currentValue = val
        this.$emit('input', val)
        this.$emit('on-change', val)
        this.dispatch('FormItem', 'on-form-change', val)
      })
    },
    focus (event) {
      this.focused = true
      this.$emit('on-focus', event)
    },
    blur () {
      this.focused = false
      this.$emit('on-blur')
    },
    keyDown (e) {
      if (e.keyCode === 38) {
        e.preventDefault()
        this.up(e)
      } else if (e.keyCode === 40) {
        e.preventDefault()
        this.down(e)
      }
    },
    change (event) {
      if (event.type === 'input' && !this.activeChange) return
      // 限制20位，超出24位时候为NaN
      let val = event.target.value.trim().substring(0, 20)
      if (this.parser) {
        val = this.parser(val)
      }
      /**
       * 文本长度是否大于限制的长度
       * 可能包含小数点
       */
      if (val.length > this.length) {
        if (val.indexOf('.') !== -1) {
          let vals = val.split('.')
          let integerValue = vals[0]
          val = integerValue.substring(0, this.length) + '.' + vals[1]
        } else {
          val = val.substring(0, this.length)
        }
      }

      const isEmptyString = (val === null || val === '') ? true : val.length === 0
      if (isEmptyString) {
        this.setValue(null)
        return
      }
      if (event.type === 'input' && val.toString().match(/^-?\.?$|\.$/)) return // prevent fire early if decimal. If no more input the change event will fire later

      val = Number(val)
      if (!isNaN(val)) {
        this.currentValue = val
        this.setValue(val)
      } else {
        event.target.value = this.currentValue
      }
    },
    changeVal (val) {
      val = Number(val)
      // this.setValue(val);
      if (!isNaN(val)) {
        const step = this.step
        this.upDisabled = val + step > this.max
        this.downDisabled = val - step < this.min
      } else {
        this.upDisabled = true
        this.downDisabled = true
      }
    },
    transform2Chinese (value) {
      if (value && value > 9999.99) {
        return money2chinese(value)
      }
      return ''
    }
  }
}
</script>
<style lang="stylus" scoped>
.ivu-input-number
  overflow visible
  &-w100
    width 100%
  &-fee-chinese
    position absolute
    top 34px
    line-height 17px
    white-space nowrap
  &-input-wrap
    height 30px
</style>
