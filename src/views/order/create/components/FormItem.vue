<template>
  <div :class="classes">
    <label v-if="label || $slots.label" :class="[prefixCls + '-label']" :for="labelFor" :style="labelStyles"><slot name="label">{{ label }}</slot></label>
    <div :class="[prefixCls + '-content']" :style="contentStyles" style="margin-right: 6px">
      <slot></slot>
      <transition name="fade">
        <Tooltip :content="validateMessage" transfer class="errTip">
          <Icon v-if="validateState === 'error' && showMessage && form.showMessage" class="vermiddle" type="ios-information-circle" size="16" color="#f00"></Icon>
        </Tooltip>
        <!-- <div v-if="validateState === 'error' && showMessage && form.showMessage" :class="[prefixCls + '-error-tip']">{{ validateMessage }}</div> -->
      </transition>
    </div>
  </div>
</template>
<script>
import AsyncValidator from 'async-validator'

const prefixCls = 'ivu-form-item'
function broadcast (componentName, eventName, params) {
  this.$children.forEach(child => {
    const name = child.$options.name

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params))
    } else {
      // todo 如果 params 是空数组，接收到的会是 undefined
      broadcast.apply(child, [componentName, eventName].concat([params]))
    }
  })
}
function getPropByPath (obj, path) {
  let tempObj = obj
  path = path.replace(/\[(\w+)\]/g, '.$1')
  path = path.replace(/^\./, '')

  let keyArr = path.split('.')
  let i = 0

  for (let len = keyArr.length; i < len - 1; ++i) {
    let key = keyArr[i]
    if (key in tempObj) {
      tempObj = tempObj[key]
    } else {
      throw new Error('[iView warn]: please transfer a valid prop path to form item!')
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj[keyArr[i]]
  }
}

export default {
  name: 'FormItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: Number
    },
    prop: {
      type: String
    },
    required: {
      type: Boolean,
      default: false
    },
    rules: {
      type: [Object, Array]
    },
    error: {
      type: String
    },
    validateStatus: {
      type: Boolean
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    labelFor: {
      type: String
    }
  },
  data () {
    return {
      prefixCls: prefixCls,
      isRequired: false,
      validateState: '',
      validateMessage: '',
      validateDisabled: false,
      validator: {}
    }
  },
  inject: ['form'],
  computed: {
    classes () {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-required`]: this.required || this.isRequired,
          [`${prefixCls}-error`]: this.validateState === 'error',
          [`${prefixCls}-validating`]: this.validateState === 'validating'
        }
      ]
    },
    fieldValue: {
      cache: false,
      get () {
        const model = this.form.model
        if (!model || !this.prop) { return }

        let path = this.prop
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.')
        }

        return getPropByPath(model, path).v
      }
    },
    labelStyles () {
      let style = {}
      const labelWidth = this.labelWidth === 0 || this.labelWidth ? this.labelWidth : this.form.labelWidth

      if (labelWidth || labelWidth === 0) {
        style.width = `${labelWidth}px`
      }
      return style
    },
    contentStyles () {
      let style = {}
      const labelWidth = this.labelWidth === 0 || this.labelWidth ? this.labelWidth : this.form.labelWidth

      if (labelWidth || labelWidth === 0) {
        style.marginLeft = `${labelWidth}px`
      }
      return style
    }
  },
  watch: {
    error (val) {
      this.validateMessage = val
      this.validateState = val === '' ? '' : 'error'
    },
    validateStatus (val) {
      this.validateState = val
    },
    rules () {
      this.setRules()
    }
  },
  mounted () {
    if (this.prop) {
      this.dispatch('iForm', 'on-form-item-add', this)

      Object.defineProperty(this, 'initialValue', {
        value: this.fieldValue
      })

      this.setRules()
    }
  },
  beforeDestroy () {
    this.dispatch('iForm', 'on-form-item-remove', this)
  },
  methods: {
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
    },
    broadcast (componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params)
    },
    setRules () {
      let rules = this.getRules()
      if (rules.length && this.required) {
        return
      } else if (rules.length) {
        rules.every((rule) => {
          this.isRequired = rule.required
        })
      } else if (this.required) {
        this.isRequired = this.required
      }
      this.$off('on-form-blur', this.onFieldBlur)
      this.$off('on-form-change', this.onFieldChange)
      this.$on('on-form-blur', this.onFieldBlur)
      this.$on('on-form-change', this.onFieldChange)
    },
    getRules () {
      let formRules = this.form.rules
      const selfRules = this.rules

      formRules = formRules ? formRules[this.prop] : []

      return [].concat(selfRules || formRules || [])
    },
    getFilteredRule (trigger) {
      const rules = this.getRules()

      return rules.filter(rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1)
    },
    validate (trigger, callback = function () {}) {
      let rules = this.getFilteredRule(trigger)
      if (!rules || rules.length === 0) {
        if (!this.required) {
          callback()
          return true
        } else {
          rules = [{ required: true }]
        }
      }

      this.validateState = 'validating'

      let descriptor = {}
      descriptor[this.prop] = rules

      const validator = new AsyncValidator(descriptor)
      let model = {}

      model[this.prop] = this.fieldValue

      validator.validate(model, { firstFields: true }, errors => {
        this.validateState = !errors ? 'success' : 'error'
        this.validateMessage = errors ? errors[0].message : ''

        callback(this.validateMessage)
      })
      this.validateDisabled = false
    },
    resetField () {
      this.validateState = ''
      this.validateMessage = ''

      let model = this.form.model
      let value = this.fieldValue
      let path = this.prop
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.')
      }

      let prop = getPropByPath(model, path)

      if (Array.isArray(value)) {
        this.validateDisabled = true
        prop.o[prop.k] = [].concat(this.initialValue)
      } else {
        this.validateDisabled = true
        prop.o[prop.k] = this.initialValue
      }
    },
    onFieldBlur () {
      this.validate('blur')
    },
    onFieldChange () {
      if (this.validateDisabled) {
        this.validateDisabled = false
        return
      }

      this.validate('change')
    }
  }
}
</script>
<style lang="stylus" scoped>
.ivu-form-item
  margin-bottom 3px
.ivu-tooltip-inner
  color #FF3C46
  background-color rgba(255,241,240,1)
.ivu-tooltip-popper[x-placement^=bottom]
  .ivu-tooltip-arrow
    border-bottom-color rgba(255,241,240,1)
</style>
<style lang="stylus">
.errTip
  position absolute
  right 0px
  top 0
  z-index 10

</style>
