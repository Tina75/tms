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
      <span v-show="nameSeleced" slot="append" :style="{paddingLeft: (currentValue.length * 12 + 10) + 'px'}" style="display: block;line-height: 24px; text-align: left;" @click="inputFocus">{{nameSeleced}}</span>
      <Icon v-if="mousehover && isClearable" slot="suffix" type="ios-close-circle" class="select-input__clear-icon" @click.native.stop="handleClear"></Icon>
      <Icon v-if="!mousehover || !isClearable" slot="suffix" type="ios-arrow-down" class="select-input__input-icon"></Icon>
      </Input>
    </div>
    <DropdownMenu ref="dropdown" slot="list"  :style="{'max-height':'150px', overflow:'auto'}">
      <DropdownItem
        v-for="(option, index) in options"
        :key="index"
        :name="option.name"
        :disabled="option.disabled"
        :class="{'ivu-select-item-focus': focusIndex === index,'isDataNull':option.disabled}"
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
import cityUtil from '@/libs/js/city'
export default {
  name: 'SelectInputForCity',
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
    value: [Number, String],
    // 返回数据范围 1-省及省以下数据 2-市及市以下数据 3-区数据
    codeType: {
      type: Number,
      default: 2
    },
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
      default: '请输入城市中文/拼音'
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
      code: '',
      visible: false,
      composing: false, // 中文输入法不希望在写拼音的时候触发input，搜索；是在完成中文后再搜索,IME问题
      focusIndex: -1,
      currentValue: '',
      currentValueCopy: '',
      mousehover: false,
      isRemoteCall: false, // 当前是否正在请求，防止请求太频繁
      options: [],
      nameSeleced: ''
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
      console.log('value:' + value + ',code' + this.code)
      this.setCurrentValue(value)
    },
    currentValue (value) {
      if (value !== this.currentValueCopy) {
        this.code = null
        this.nameSeleced = ''
        this.$emit('input', null)
      }
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
        return child.$options.propsData.name === option.name
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
    // const vm = this
    // if (this.onlyChinese) {
    //   const originInput = this.$refs.input.$refs.input
    //   originInput.addEventListener('compositionstart', vm.onCompositionStart)
    //   originInput.addEventListener('compositionend', vm.onCompositionEnd)
    // }
    if (this.value) {
      this.setCurrentValue(this.value)
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
        return text.replace(reg, '<b style="color:#00A4BD">$1</b>')
      }
      return text
    },
    // 应对编辑时，code -> 对应省份
    setCurrentValue (code) {
      if (code === this.code) return
      if (!code) {
        this.code = null
        this.currentValue = ''
        return
      }
      this.code = code
      let city = cityUtil.getPathByCode(code)
      let item = {
        province: city[0].name,
        city: city[1] ? city[1].name : '',
        area: city[2] ? city[2].name : ''
      }
      const itemName = this.cityShow(item, 1)
      this.currentValue = itemName.split(',  ')[0]
      this.nameSeleced = this.cityShow(item, 2).split('  ')[1]
      this.currentValueCopy = itemName.split(',  ')[0]
    },
    // 清空
    handleClear () {
      this.$emit('on-clear')

      this.currentValue = ''
      this.focusIndex = -1
      this.code = null
      this.$emit('input', null)
    },
    // 点击下拉框项
    handleSelect (name) {
      const item = this.options.find((opt) => {
        if (opt.name) {
          return opt.name === name
        }
        return opt.value === name
      })
      this.currentValue = item.name.split(',  ')[0]
      this.nameSeleced = item.nameSeleced.split('  ')[1]
      this.currentValueCopy = item.name.split(',  ')[0]
      this.code = item.code
      this.focusIndex = -1
      this.visible = false
      // 选中某一项
      this.$emit('on-select', item.code, item)
      this.$emit('input', item.code)
      this.dispatch.call(this.$parent, 'FormItem', 'on-form-change', item.code)
    },
    handleFocus () {
      // this.visible = true
      this.isFocus = true
      if (!this.currentValue) { // 输入框为空，且获得焦点，则取历史数据
        // 鼠标focus的时候，需要默认查询所有
        this.takeCity()
      }
      this.$emit('on-focus')
    },
    handleBlur () {
      this.resetSelect()
      // 设置输入框的值，不选择下拉框的选项
      // this.$emit('input', this.currentValue)
      this.$emit('on-blur', this.currentValue)
      if (this.currentValue !== this.currentValueCopy) {
        this.currentValue = ''
      }
    },
    /**
       * 更改关键字，input onChange事件
       */
    handleChange (e) {
      this.remoteCall(e.target.value)
      if (!e.target.value) {
        this.visible = false
        return
      }
      this.visible = true
    },
    // 远程请求
    remoteCall (query) {
      let validQuery = !this.isRemoteCall && !this.composing && query
      if (validQuery) {
        this.isRemoteCall = true
        server({
          method: 'get',
          url: 'city/search',
          ignoreCode: true,
          params: {
            text: query,
            codeType: this.codeType
          }
        }).then(response => {
          this.isRemoteCall = false
          const options = response.data.data
          if (!options || options.length === 0) {
            this.options = [{ name: '未查询到相关城市数据', disabled: true }]
            return
          }
          this.options = options.map((item, index) => {
            let name = this.cityShow(item, 1)
            let nameSeleced = this.cityShow(item, 2)
            let obj = { name: name, nameSeleced: nameSeleced }
            return Object.assign({}, item, obj)
          })
          this.$nextTick(() => {
            this.focusIndex = 0
          })
        }).catch(err => {
          this.isRemoteCall = false
          console.log(err)
          if (err.message && err.message.indexOf('timeout') !== -1) {
            this.options = [{ name: '网络开小差了～请稍后重试', disabled: true }]
            return
          }
          this.options = [{ name: '系统数据异常，请联系客服处理', disabled: true }]
        })
      }
    },
    cityShow (item, type) {
      if (type === 1) {
        return (item.area ? item.area : '') + (item.area && item.city ? ',  ' : '') +
        (item.city ? item.city : '') + (item.city && item.province ? ',  ' : '') +
        (item.province ? item.province : '')
      } else {
        // this.nameSeleced = item.city ? item.city : ''
        return (item.area ? item.area + '  ' : '') + (item.city ? item.city : '')
        // (item.province ? item.province : '')
      }
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
    },
    // 存数据
    saveCity (code) {
      if (!code) {
        return
      }
      // 首先判断需要存储的code是否已经存在
      let cityArray = localStorage.getItem('cityInfo') ? JSON.parse(localStorage.getItem('cityInfo')) : []
      for (let i = 0; i < cityArray.length; i++) {
        if (cityArray[i].code === code) {
          return
        }
      }
      // 此时确定code需要保存，取出对应的省份信息
      let city = cityUtil.getPathByCode(code)
      let nameItem = {
        area: city[2] ? city[2].name : '',
        city: city[1].name,
        province: city[0].name
      }
      let name = this.cityShow(nameItem, 1)
      let nameSeleced = this.cityShow(nameItem, 2)
      let obj = { name: name, nameSeleced: nameSeleced, code: code }
      // 取历史数据，和5比较
      if (cityArray.length >= 5) {
        cityArray.length = 4
      }
      cityArray.unshift(obj)
      localStorage.setItem('cityInfo', JSON.stringify(cityArray))
    },
    // 取数据
    takeCity () {
      this.visible = true
      this.options = JSON.parse(localStorage.getItem('cityInfo')) || []
      this.options.length > 0 ? this.$nextTick(() => {
        this.focusIndex = 0
      }) : this.focusIndex = -1
    },
    inputFocus () {
      this.$refs['input'].focus()
    }
  }
}
</script>

<style scoped lang="stylus">
  .isDataNull
    color #FF9502
  .select-input
    &__input
      display inline-block
    &__dropdown
      width 100%
      .ivu-input-wrapper
        /deep/ .ivu-input-suffix
          z-index 10
        /deep/ .ivu-input-group-append
          /*font-size 12px*/
          pointer-events none
          z-index: 100;
          color: rgba(0,0,0,0.2);
          position: absolute;
          background: rgba(255, 255, 255, 0);
          left: 1px
          border: none;
          top: 1px;
    &__clear-icon
      cursor pointer
    &__input-icon
      display none
      transition transform 0.2s ease-in-out
      -webkit-transition -webkit-transform 0.2s ease-in-out
      -moz-transition  -moz-transform 0.2s ease-in-out
</style>
