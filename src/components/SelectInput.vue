<template>
  <Dropdown
    :visible="showDropdown"
    :transfer="transfer || selfTransfer"
    :placement="placement"
    trigger="custom"
    class="select-input__dropdown"
    @on-click="handleSelect"
    @on-clickoutside="handleBlur"
  >
    <div
      @keydown.up.prevent="handleKeydown"
      @keydown.down.prevent="handleKeydown"
      @keydown.enter="handleKeydown"
      @mouseenter="mousehover = true"
      @mouseleave="mousehover = false"
    >
      <Input
        ref="input"
        v-model="parsedValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :class="classes"
        :disabled="disabled"
        @on-change="handleChange"
        @on-focus="handleFocus"
      >
      <Icon v-if="mousehover && isClearable" slot="suffix" type="ios-close-circle" class="select-input__clear-icon" @click.native.stop="handleClear"></Icon>
      <Icon v-if="!mousehover || !isClearable" slot="suffix" type="ios-arrow-down" class="select-input__input-icon"></Icon>
    </Input>
    </div>
    <DropdownMenu ref="dropdown" slot="list" :style="{'max-height':'150px', overflow:'auto'}">
      <DropdownItem
        v-for="(option, index) in filterOptions"
        :key="index"
        :name="option.name"
        :class="{'ivu-select-item-focus': focusIndex === index}"
        v-html="heightlightText(option.name)">
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
/**
 * 选择 | 输入框，
 * 支持下拉选择，也支持输入的组件
 * 同时支持请求查询服务端，显示数据
 * 关于blur事件
 * 1. 如果挂靠在input输入框，ie11兼容性问题，鼠标拖动滚动条下拉框消失
 * 2. 如果挂靠在dropdown，在没有下拉框的时候，没法触发blur；比如：车牌号大小写问题
 * 3. 如果外面包一层div，问题更严重，会不断触发同一页面其他selectinput组件的blur事件
 */
import browser from '@/libs/js/browser'
export default {
  name: 'SelectInput',
  props: {
    autoFocus: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    maxlength: Number,
    value: String,
    // 中文搜索的时候，在拼音阶段不搜索
    onlyChinese: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: false
    },
    transfer: {
      type: Boolean,
      default: false
    },
    localOptions: {
      type: Array,
      default: () => []
    },
    remote: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    // 点击下拉框项
    onSelect: {
      type: Function
    },
    onFoucs: Function,
    onClear: Function,
    remoteMethod: {
      type: Function
    },
    noFilter: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    /**
     * 显示时候的值，回调函数
     * 比如：手机号，银行卡号，间隔显示，但是最终的值不保留间隔
     */
    parser: Function,
    /**
     * 输入框的值，经过该函数，值发生变化
     * 比如：车牌号大写
     */
    formatter: Function
  },
  data () {
    return {
      isFocus: false,
      visible: false,
      composing: false, // 中文输入法不希望在写拼音的时候触发input，搜索；是在完成中文后再搜索,IME问题
      focusIndex: -1,
      currentValue: this.value,
      selfTransfer: false,
      mousehover: false,
      lastRemoteQuery: null,
      isRemoteCall: false,
      options: this.localOptions.slice()
    }
  },
  computed: {
    /**
     * input输入框编辑的时候顺序
     * 1. 输入值，开始set函数，需要trim，过滤空格,
     * 2. 走onChange 回调事件，emit currentvalue
     * 3. 最后输入框读取值，调用get函数，再进行parser
     */
    parsedValue: {
      get () {
        if (this.parser) {
          return this.parser(this.currentValue)
        }
        return this.currentValue
      },
      set (value) {
        /**
         * formatter函数影响中文输入法
         */
        if (this.formatter && !this.composing) {
          value = this.formatter(value) || ''
        }
        this.currentValue = value.trim()
      }

    },
    /**
     * 过滤下拉框选项
     * 可以通过noFilter参数不过滤
     * 1. 远程请求的结果不过滤
     * 2. 本地的需要过滤
     */
    filterOptions () {
      if (this.remote || !this.currentValue || this.noFilter) {
        return this.options
      } else {
        return this.options.filter(opt => opt.name.indexOf(this.currentValue) !== -1)
      }
    },
    // 显示下拉框
    showDropdown () {
      return this.visible && this.filterOptions.length > 0 && this.isFocus
    },
    classes () {
      return [
        'select-input__input',
        this.showDropdown ? 'select-input__input-visible' : ''
      ]
    },
    notEmpty () {
      return typeof this.currentValue !== 'undefined' && String(this.currentValue).trim() !== ''
    },
    isClearable () {
      return this.notEmpty && this.clearable
    }

  },
  watch: {
    value (value) {
      this.setCurrentValue(value)
    },
    localOptions (newOptions) {
      if (!this.remote) {
        this.options = newOptions.slice()
      }
    },
    /**
     * 主动操作滚动条，到选中的option视图
     */
    focusIndex (index) {
      if (index < 0) {
        return false
      }
      const option = this.filterOptions[index]
      const dropdownInstance = this.$refs.dropdown
      const optionInstance = dropdownInstance.$children.find((child) => {
        return child.$options.propsData.name === option.value
      })

      let bottomDistance = optionInstance.$el.getBoundingClientRect().bottom - dropdownInstance.$el.getBoundingClientRect().bottom
      let topDistance = optionInstance.$el.getBoundingClientRect().top - dropdownInstance.$el.getBoundingClientRect().top

      if (bottomDistance > 0) {
        dropdownInstance.$el.scrollTop += bottomDistance
      } else if (topDistance < 0) {
        dropdownInstance.$el.scrollTop += topDistance
      }
    }
  },
  mounted () {
    const vm = this
    // 加载默认focus
    if (this.autoFocus) {
      this.isFocus = true
      this.visible = true
      this.$nextTick(() => {
        this.$refs.input.$refs.input.focus()
      })
    }
    /**
     * formatter 函数在输入中文的时候也会执行，影响中文输入法
     */
    if (this.onlyChinese && (this.remote || this.formatter)) {
      const originInput = this.$refs.input.$refs.input
      originInput.addEventListener('compositionstart', vm.onCompositionStart)
      originInput.addEventListener('compositionend', vm.onCompositionEnd)
    }
    if (browser.ie && browser.ie10Compat) {
      this.selfTransfer = true
      this.unwatch = this.$watch('$route', () => {
        if (vm.visible) {
          vm.resetSelect()
        }
      })
    }
  },
  beforeDestroy () {
    if (this.unwatch) {
      this.unwatch()
    }
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
    onCompositionStart () {
      this.composing = true
    },
    /**
     * 中文输入结束后触发搜索
     * 绑定改事件后，不触发handleChange
     * 所以主动调用handleChange
     */
    onCompositionEnd (e) {
      this.composing = false
      this.handleChange(e)
    },
    heightlightText (text) {
      if (this.currentValue) {
        let reg = new RegExp('(' + this.currentValue + ')', 'g')
        return text.replace(reg, '<b style="color:#ec4e4e">$1</b>')
      }
      return text
    },
    setCurrentValue (value) {
      if (value === this.currentValue) return

      this.currentValue = value
    },
    // 清空
    handleClear () {
      this.$emit('on-clear')

      this.currentValue = ''
      this.focusIndex = -1
      this.$emit('input', this.currentValue)
    },
    // 点击下拉框项
    handleSelect (name) {
      const item = this.options.find((opt) => {
        if (opt.name) {
          return opt.name === name
        }
        return opt.value === name
      })
      this.setCurrentValue(item.value)
      this.focusIndex = -1
      this.visible = false
      // 选中某一项
      this.$emit('on-select', item.value, item)
      this.$emit('input', item.value, 'on-select')
    },
    /**
     * 鼠标focus
     */
    handleFocus () {
      this.visible = true
      this.isFocus = true
      if (this.remote) {
        // 鼠标focus的时候，需要默认查询所有
        this.remoteCall(this.currentValue)
      }
      this.$emit('on-focus')
    },
    handleBlur () {
      this.resetSelect()
      // 设置输入框的值，不选择下拉框的选项
      // this.$emit('input', this.currentValue)
      this.$emit('on-blur', this.currentValue)
    },
    /**
     * 更改关键字，input onChange事件
     */
    handleChange (e) {
      if (this.remote) {
        this.remoteCall(e.target.value)
      }
      this.visible = true
      this.$emit('input', this.currentValue)
      this.dispatch.call(this.$parent, 'FormItem', 'on-form-change', this.currentValue)
    },
    // 远程请求
    remoteCall (query) {
      let validQuery = this.lastRemoteQuery !== query && !this.isRemoteCall && !this.composing
      let shouldCallRemote = this.remoteMethod && typeof this.remoteMethod === 'function' && this.remote
      if (validQuery && shouldCallRemote) {
        this.isRemoteCall = true
        const promise = this.remoteMethod(query)
        if (promise && promise.then) {
          promise.then((options) => {
            this.isRemoteCall = false
            this.options = options
          }).catch(errorInfo => {
            this.isRemoteCall = false
          })
        }
        this.lastRemoteQuery = query
      }
    },
    /**
     * 键盘上下箭头和回车事件
     */
    handleKeydown (e) {
      if (this.visible) {
        e.preventDefault()
        const keyCode = e.key.toLowerCase()
        if (keyCode === 'arrowup' || keyCode === 'up') {
          this.focusOption(-1)
        } else if (keyCode === 'arrowdown' || keyCode === 'down') {
          this.focusOption(1)
        } else if (keyCode === 'enter') {
          if (this.focusIndex === -1) {
            // 关闭菜单
            this.visible = false
          } else {
            const selectOption = this.filterOptions[this.focusIndex]
            if (selectOption) {
              this.handleSelect(selectOption.name)
            }
          }
        }
      }
    },
    /**
     * 选项背景高亮
     */
    focusOption (direction) {
      let index = this.focusIndex + direction
      const optionsLength = this.filterOptions.length - 1
      if (index < 0) {
        index = optionsLength
      } else if (index > optionsLength) {
        index = 0
      }
      this.focusIndex = index
    },
    /**
     * 重置参数
     * 1. blur触发
     */
    resetSelect () {
      this.focusIndex = -1
      this.visible = false
      this.isFocus = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.select-input
  &__dropdown
    width 100%
  &__input
    &-visible
      .select-input__input-icon
        transform rotate(180deg)
        -moz-transform rotate(180deg)
        -webkit-transform rotate(180deg)
  &__clear-icon
    cursor pointer
  &__input-icon
    display none !important
    transition transform 0.2s ease-in-out
    -webkit-transition -webkit-transform 0.2s ease-in-out
    -moz-transition  -moz-transform 0.2s ease-in-out
</style>
