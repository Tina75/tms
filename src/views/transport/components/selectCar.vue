<template>
  <SelectInput v-model="currentValue"
               :maxlength="8"
               :local-options="list"
               placeholder="请选择"
               @on-select="selectDriver"
               @on-blur="inputDriver" />
</template>

<script>
import SelectInput from '@/components/SelectInput'
import Server from '@/libs/js/server'

const reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})/

export default {
  name: 'SelectDriver',
  components: { SelectInput },
  props: {
    value: String,
    carrierId: String
  },
  data () {
    return {
      currentValue: this.value,
      list: []
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    carrierId (val) {
      this.carrierId = val
      if (this.carrierId) this.fetchDriver()
      else this.list = []
    }
  },
  methods: {
    fetchDriver () {
      Server({
        url: '/carrier/list/car',
        method: 'get',
        data: {
          carrierId: this.carrierId
        }
      }).then(res => {
        this.list = res.data.data.carList
      }).catch(err => console.error(err))
    },

    selectDriver (val, item) {
      this.$emit('input', item.name)
      this.$emit('on-change', item)
    },

    inputDriver (val) {
      this.$emit('input', val)
      this.$emit('on-change', { name: val, value: '' })
    },

    validate () {
      console.log(reg.test(this.currentValue))
      return reg.test(this.currentValue)
    }
  }
}
</script>
