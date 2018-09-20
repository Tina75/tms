<template>
  <SelectInput v-model="currentValue"
               :maxlength="20"
               :local-options="list"
               :placeholder="placeholder"
               @on-select="selectDriver"
               @on-blur="inputDriver" />
</template>

<script>
import SelectInput from '@/components/SelectInput'
import Server from '@/libs/js/server'

export default {
  name: 'SelectDriver',
  components: { SelectInput },
  props: {
    value: String,
    carrierId: String,
    placeholder: String
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
        url: '/carrier/list/driver',
        method: 'get',
        data: {
          carrierId: this.carrierId
        }
      }).then(res => {
        this.list = res.data.data.driverList
      }).catch(err => console.error(err))
    },

    selectDriver (val, item) {
      this.$emit('input', item.name)
      this.$emit('on-change', item)
    },

    inputDriver (val) {
      this.$emit('input', val)
      this.$emit('on-change', { name: val, value: '' })
    }
  }
}
</script>
