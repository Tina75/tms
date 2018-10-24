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
  </div>
</template>
<script>
import Emitter from 'iview/src/mixins/emitter'
const prefixCls = 'ivu-input-number'
export default {
  name: 'InputNumber',
  mixins: [Emitter],
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
      type: Number,
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
    precision: {
      type: Number
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
      return this.precision ? this.currentValue.toFixed(this.precision) : this.currentValue
    },
    formatterValue () {
      if (this.formatter && this.precisionValue !== null) {
        return this.formatter(this.precisionValue)
      } else {
        return this.precisionValue
      }
    }
  },
  watch: {
    value (val) {
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
      if (val && !isNaN(this.precision)) val = Number(Number(val).toFixed(this.precision))

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
      let val = event.target.value.trim()
      if (this.parser) {
        val = this.parser(val)
      }

      const isEmptyString = val.length === 0
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
    }
  }
}
</script>
<style lang="stylus">
.ivu-input-number-w100
  width 100%
</style>
