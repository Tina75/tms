<template>
  <Dropdown
    :visible="showDropdown"
    :transfer="transfer"
    :placement="placement"
    class="select-input__dropdown"
    trigger="custom"
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
        v-model="currentValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :class="classes"
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
        :key="option.name"
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
 */
export default {
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
    }
  },
  data () {
    return {
      isFocus: false,
      visible: false,
      composing: false, // 中文输入法不希望在写拼音的时候触发input，搜索；是在完成中文后再搜索,IME问题
      focusIndex: -1,
      currentValue: this.value,
      mousehover: false,
      lastRemoteQuery: null,
      isRemoteCall: false,
      options: this.localOptions.slice()
    }
  },
  computed: {
    filterOptions () {
      if (this.remote || !this.currentValue || this.noFilter) {
        return this.options
      } else {
        return this.options.filter(opt => opt.name.indexOf(this.currentValue) !== -1)
      }
    },
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
    if (this.onlyChinese && this.remote) {
      const originInput = this.$refs.input.$refs.input
      originInput.addEventListener('compositionstart', vm.onCompositionStart)
      originInput.addEventListener('compositionend', vm.onCompositionEnd)
    }
  },
  methods: {
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
