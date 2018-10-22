<template>
  <Dropdown
    :visible="showDropdown"
    :transfer="transfer"
    :placement="placement"
    class="select-input__dropdown"
    trigger="custom"
    @on-click="handleSelect"
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
        @on-blur="handleBlur">
      <Icon v-if="mousehover && isClearable" slot="suffix" type="ios-close-circle" class="select-input__clear-icon" @click.native.stop="handleClear"></Icon>
      </Input>
    </div>
    <DropdownMenu ref="dropdown" slot="list" :style="{'max-height':'150px', overflow:'auto'}">
      <DropdownItem
        v-for="(option, index) in options"
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
import server from '@/libs/js/server'
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
    placeholder: {
      type: String,
      default: '请输入中文/ 拼音'
    },
    // 点击下拉框项
    onSelect: {
      type: Function
    },
    onFoucs: Function,
    onClear: Function,
    remoteMethod: {
      type: Function
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
      isRemoteCall: false, // 当前是否正在请求，防止请求太频繁
      options: [
        { name: '安徽', value: 1 },
        { name: '河北', value: 1 },
        { name: '南京', value: 1 }
      ]
    }
  },
  computed: {
    showDropdown () {
      return this.visible && this.options.length > 0 && this.isFocus
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
    /**
       * 主动操作滚动条，到选中的option视图
       */
    focusIndex (index) {
      if (index < 0) {
        return false
      }
      const option = this.options[index]
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
    if (this.onlyChinese) {
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
      this.currentValue = item.value
      this.resetSelect()
      // 选中某一项
      this.$emit('on-select', item.value, item)
      this.$emit('input', item.value)
    },
    handleFocus () {
      this.visible = true
      this.isFocus = true
      // if (this.remote) {
      //   // 鼠标focus的时候，需要默认查询所有
      //   this.remoteCall(this.currentValue)
      // }
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
      this.remoteCall(e.target.value)
      this.visible = true
      this.$emit('input', this.currentValue)
    },
    // 远程请求
    remoteCall (query) {
      let validQuery = this.lastRemoteQuery !== query && !this.isRemoteCall && !this.composing
      let shouldCallRemote = this.remoteMethod && typeof this.remoteMethod === 'function'
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
      server({
        method: 'get',
        url: 'city/search',
        params: {
          text: query
        }
      }).then(response => {
        const options = response.data.data
        console.log(options)
        this.options = options.map()
      })
    },
    handleKeydown (e) {
      if (this.visible) {
        e.preventDefault()
        const keyCode = e.key.toLowerCase()
        if (keyCode === 'arrowup') {
          this.focusOption(-1)
        } else if (keyCode === 'arrowdown') {
          this.focusOption(1)
        } else if (keyCode === 'enter') {
          if (this.focusIndex === -1) {
            // 关闭菜单
            this.visible = false
          } else {
            const selectOption = this.options[this.focusIndex]
            if (selectOption) {
              this.handleSelect(selectOption.name)
            }
          }
        }
      }
    },
    focusOption (direction) {
      let index = this.focusIndex + direction
      const optionsLength = this.options.length - 1
      if (index < 0) {
        index = optionsLength
      } else if (index > optionsLength) {
        index = 0
      }
      this.focusIndex = index
    },
    resetSelect () {
      this.focusIndex = -1
      this.visible = false
      this.isFocus = false
    }
  }
}
</script>

<style lang="stylus">
  .select-input
    &__dropdown
      width 100%
    &__clear-icon
      cursor pointer
    &__input-icon
      display none
      transition transform 0.2s ease-in-out
      -webkit-transition -webkit-transform 0.2s ease-in-out
      -moz-transition  -moz-transform 0.2s ease-in-out
</style>
