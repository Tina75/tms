<template>
  <Dropdown :visible="visible" class="order-create__input-select" trigger="custom" @on-click="handleSelect">
    <Input
      v-model="currentValue"
      :maxlength="maxlength"
      icon="ios-arrow-down"
      @on-change="handleChange"
      @on-focus="handleFocus"
      @on-blur="handleBlur">
    </Input>
    <DropdownMenu slot="list">
      <DropdownItem v-for="option in filterOptions" :key="option.name" :name="option.value" v-html="heightlightText(option.name)"></DropdownItem>
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
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
    heightlightText (text) {
      if (this.currentValue) {
        let reg = new RegExp('(' + this.currentValue + ')', 'g')
        return text.replace(reg, '<b>$1</b>')
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
      // 设置输入框的值，不选择下拉框的选项
      this.$emit('input', this.currentValue)
    },
    /**
     * 更改关键字，input onChange事件
     */
    handleChange (e) {
      if (this.remote) {
        this.remoteCall(e.target.value)
      }
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.order-create
  &__input-select
    width 100%
</style>
