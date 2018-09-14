<template>
  <Cascader
    ref="selector"
    v-model="selected"
    :data="areaData"
    :render-format="formatArea"
    :load-data="loadData"
    change-on-select
    filterable
    @on-change="handleChange">
  </Cascader>
</template>

<script>
// import area from '@/libs/js/area'
import areas from '@/libs/js/City'
export default {
  props: {
    value: [String, Array],
    // 部分组件位置偏，弹出窗容易遮盖，设置true时，可实时调整位置
    adjustment: false,
    onChange: Function
  },
  data () {
    return {
      areaData: [],
      selected: []
    }
  },
  watch: {
    value (newValue) {
      if (newValue.join('') !== this.selected.join('') && newValue && typeof newValue === 'string') {
        this.selected = areas.getPathByCode(this.value).map((item) => item.code)
      } else if (!newValue || newValue.length === 0) {
        this.selected = []
      }
    }
  },
  created () {
    this.areaData = areas.getAllRoots().map((item) => {
      return {
        value: item.code,
        label: item.name,
        children: [],
        loading: false,
        hasChild: true
      }
    })
  },
  mounted () {
    if (this.value && typeof this.value === 'string') {
      this.selected = areas.getPathByCode(this.value).map((item) => item.code)
    }
  },
  methods: {
    loadData (item, callback) {
      item.loading = true
      const children = areas.getAllChild(item.value)
      if (children.length > 0) {
        item.children = children.map(item => {
          let data = {
            value: item.code,
            label: item.name,
            parent: item.parent
          }
          if (item.hasChild) {
            data.children = []
            data.loading = false
            data.hasChild = true
          }
          return data
        })
      }

      item.loading = false
      callback()
    },
    handleChange (value, selectedData) {
      if (this.adjustment) {
        // 边缘位置，下拉框会导致出界看不见，所以目的城市在选择时要随时更新坐标值
        this.$refs.selector.$refs.drop.update()
      }
      this.$emit('on-change', value, selectedData)
      this.$emit('input', value)
    },

    // 格式化省市区
    formatArea (labels, selectedData) {
      let set = new Set(labels)
      return Array.from(set).join('')
    }
  }
}
</script>

<style>

</style>
