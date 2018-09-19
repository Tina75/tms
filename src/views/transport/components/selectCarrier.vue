<template>
  <SelectInput v-model="currentValue"
               :maxlength="20"
               :local-options="list"
               placeholder="请选择"
               @on-focus.once="fetchCarrier"
               @on-select="selectCarrier"
               @on-blur="inputCarrier" />
</template>

<script>
import SelectInput from '@/components/SelectInput'
import Server from '@/libs/js/server'

export default {
  name: 'SelectCarrier',
  components: { SelectInput },
  props: {
    value: String
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
    }
  },
  methods: {
    fetchCarrier () {
      Server({
        url: '/carrier/list',
        method: 'get',
        data: {
          type: 1,
          keyword: ''
        }
      }).then(res => {
        this.list = res.data.data.carrierList
      }).catch(err => console.error(err))
    },

    selectCarrier (val, item) {
      this.$emit('input', item.name)
      this.$emit('on-change', item)
    },

    inputCarrier (val) {
      this.$emit('input', val)
      this.$emit('on-change', { name: val, value: '' })
    }
  }
}
</script>
