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
import SelectInput from '@/components/SelectInput'
import Server from '@/libs/js/server'

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
      validator: (value) => ['carrier', 'driver', 'carNo'].indexOf(value) !== -1
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
    carrierId () {
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      switch (this.mode) {
        case 'carrier':
          this.maxLength = 20
          this.getCarriers()
          return
        case 'driver':
          this.maxLength = 5
          this.getDrivers()
          return
        case 'carNo':
          this.maxLength = 8
          this.getCars()
      }
    },

    // 查询承运商
    getCarriers () {
      Server({
        url: '/carrier/listOrderByUpdateTimeDesc',
        method: 'get',
        data: { type: 1 }
      }).then(res => {
        this.options = res.data.data.carrierList.map(item => {
          item.name = item.carrierName
          item.value = item.carrierName
          return item
        })
        this.$emit('on-option-loaded', this.options)
      })
    },

    // 查询司机
    getDrivers () {
      if (!this.carrierId) return
      Server({
        method: 'get',
        url: 'carrier/list/driver',
        data: { carrierId: this.carrierId }
      }).then((res) => {
        this.options = res.data.data.driverList.map(item => {
          item.name = item.driverName
          item.value = item.driverName
          item.carNo = item.carNO
          delete item.carNO
          return item
        })
        this.$emit('on-option-loaded', this.options)
      })
    },

    // 查询车牌号
    getCars () {
      if (!this.carrierId) return
      Server({
        url: '/carrier/list/carOrderByUpdateTimeDesc',
        method: 'get',
        data: { carrierId: this.carrierId }
      }).then(res => {
        this.options = res.data.data.carList.map(item => {
          item.name = item.carNO
          item.value = item.carNO
          item.carNo = item.carNO
          delete item.carNO
          return item
        })
        this.$emit('on-option-loaded', this.options)
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
        this.model = this.model.toUpperCase()
      }
      this.$emit('input', this.model)
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
