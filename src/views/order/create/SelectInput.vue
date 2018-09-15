<template>
  <Dropdown
    :visible="visible"
    :transfer="transfer"
    class="order-create__input-select"
    trigger="custom"
    @on-click="handleSelect"
  >
    <div
      @keydown.up.prevent="handleKeydown"
      @keydown.down.prevent="handleKeydown"
      @keydown.enter="handleKeydown"
    >
      <Input
        v-model="currentValue"
        :maxlength="maxlength"
        icon="ios-arrow-down"
        @on-change="handleChange"
        @on-focus="handleFocus"
        @on-blur="handleBlur">
    </Input>
    </div>
    <DropdownMenu ref="dropdown" slot="list" :style="{'max-height':'150px', overflow:'auto'}">
      <DropdownItem
        v-for="(option, index) in filterOptions"
        :key="option.name"
        :name="option.value"
        :class="{'ivu-select-item-focus': focusIndex === index}"
        v-html="heightlightText(option.name)">
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
/**
 * 输入框，同时支持请求查询服务端，显示数据
 */
export default {
  props: {
    maxlength: Number,
    value: String,
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
    remoteMethod: {
      type: Function
    }
  },
  data () {
    return {
      isFocus: false,
      focusIndex: -1,
      currentValue: this.value,
      lastRemoteQuery: null,
      isRemoteCall: false,
      options: this.localOptions.slice()
    }
  },
  computed: {
    filterOptions () {
      if (this.remote) {
        return this.options
      } else {
        return this.options.filter(opt => opt.name.indexOf(this.currentValue) !== -1)
      }
    },
    visible () {
      return this.filterOptions.length > 0 && this.isFocus
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
  methods: {
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
    // 点击下拉框项
    handleSelect (name) {
      const item = this.options.find((opt) => opt.name === name || opt.value === name)
      this.currentValue = item.value
      this.focusIndex = -1
      // 选中某一项
      this.$emit('on-select', name, item)
      this.$emit('input', item.value)
    },
    handleFocus () {
      if (this.remote) {
        // 鼠标focus的时候，需要默认查询所有
        this.remoteCall()
      }
      this.isFocus = true
    },
    handleBlur () {
      this.isFocus = false
      this.focusIndex = -1
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
      this.$emit('input', this.currentValue)
    },
    // 远程请求
    remoteCall (query) {
      let validQuery = this.lastRemoteQuery !== query && !this.isRemoteCall
      let shouldCallRemote = this.remoteMethod && typeof this.remoteMethod === 'function' && this.remote
      if (validQuery && shouldCallRemote) {
        this.isRemoteCall = true
        const promise = this.remoteMethod(query)
        if (promise && promise.then) {
          promise.then((options) => {
            this.isRemoteCall = false
            this.options = options
          })
        }
        this.lastRemoteQuery = query
      }
    },
    handleKeydown (e) {
      console.log(e.key)

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
            const selectOption = this.filterOptions[this.focusIndex]
            if (selectOption) {
              this.handleSelect(selectOption.name)
            }
          }
        }
      }
    },
    focusOption (direction) {
      let index = this.focusIndex + direction
      const optionsLength = this.filterOptions.length - 1
      if (index < 0) {
        index = optionsLength
      } else if (index > optionsLength) {
        index = 0
      }
      this.focusIndex = index
    }
  }
}
</script>

<style lang="stylus" scoped>
.order-create
  &__input-select
    width 100%
</style>
