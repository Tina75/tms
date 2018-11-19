<template>
  <SelectInput
    v-model="model"
    :placeholder="placeholder"
    :remote="false"
    :clearable="clearable"
    :maxlength="maxLength"
    :local-options="options"
    @on-select="selectHandler"
    @on-blur="inputBlurHandler"
    @on-clear="clearHandler" />
</template>

<script>

/**
 * 在 @/components/SelectInput 组件基础上封装的组件
 * 可自动查询承运商、司机、车牌号、客户、外转方
 * 使用该组件时，如果需要联动，则需要使用 ../mixin/selectInputMixin
 */

import SelectInput from '@/components/SelectInput'
import { mapActions } from 'vuex'

export default {
  name: 'InputWithSelect',
  components: { SelectInput },
  props: {
    value: String,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: false
    },
    // 选择框类型
    mode: {
      type: String,
      required: true,
      validator: (value) => ['carrier', 'driver', 'carNo', 'consigner', 'transferee'].indexOf(value) !== -1
    },
    // 承运商id
    carrierId: [ String, Number ]
  },
  data () {
    return {
      model: this.value,
      maxLength: 0,
      options: []
    }
  },
  watch: {
    value (val) { this.model = val },
    model (val) { this.$emit('input', val) },
    carrierId () { this.fetchData() }
  },
  created () {
    this.fetchData()
  },
  methods: {
    ...mapActions([
      'getCarriers',
      'getCarrierDrivers',
      'getCarrierCars',
      'getClients',
      'getTransferees'
    ]),

    fetchData () {
      switch (this.mode) {
        case 'carrier':
          this.modeWithCarrier()
          return
        case 'driver':
          this.modeWithDriver()
          return
        case 'carNo':
          this.modeWithCar()
          return
        case 'consigner':
          this.modeWithConsigner()
          return
        case 'transferee':
          this.modeWithTransferee()
      }
    },

    modeWithCarrier () {
      this.maxLength = 20
      this.getCarriers().then(list => {
        this.options = list.map(item => {
          item.name = item.carrierName
          item.value = item.carrierName
          return item
        })
        this.$emit('on-option-loaded', this.options)
      })
    },
    modeWithDriver () {
      if (!this.carrierId) return
      this.maxLength = 15
      this.getCarrierDrivers(this.carrierId).then(list => {
        this.options = list.map(item => {
          item.name = item.driverName
          item.value = item.driverName
          item.carNo = item.carNO
          delete item.carNO
          return item
        })
        this.$emit('on-option-loaded', this.options)
      })
    },
    modeWithCar () {
      if (!this.carrierId) return
      this.maxLength = 8
      this.getCarrierCars(this.carrierId).then(list => {
        this.options = list.map(item => {
          item.name = item.carNO
          item.value = item.carNO
          item.carNo = item.carNO
          delete item.carNO
          return item
        })
        this.$emit('on-option-loaded', this.options)
      })
    },
    modeWithConsigner () {
      this.maxLength = 20
      this.getClients().then(list => {
        this.options = list.map(item => {
          item.value = item.name
          return item
        })
      })
    },
    modeWithTransferee () {
      this.maxLength = 20
      this.getTransferees().then(list => {
        this.options = list.map(item => {
          item.value = item.name
          return item
        })
      })
    },

    // 选择选项
    selectHandler (name, row) {
      this.model = name
      this.$emit('input', name)
      this.$emit('on-select', { name, row })
    },

    // 输入框失焦
    inputBlurHandler () {
      if (this.mode === 'carNo' && this.model) { // 车牌号小写转大写
        this.$nextTick(() => {
          this.model = this.model.toUpperCase()
          this.$emit('input', this.model)
        })
      }
    },

    // 清空
    clearHandler () {
      this.$emit('on-clear')
      this.model = ''
      this.$emit('input', this.model)
    }

  }
}
</script>
