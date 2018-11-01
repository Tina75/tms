<template>
  <AreaCascader
    ref="selector"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    v-model="selected"
    :data="areaData"
    :render-format="formatArea"
    :load-data="loadData"
    change-on-select
    filterable
    @on-change="handleChange">
  </AreaCascader>
</template>

<script>
// import area from '@/libs/js/area'
import areas from '@/libs/js/city'
// import { requestAnimationFrame, cancelAnimationFrame } from '@/libs/js/requestAnimationFrame.js'
import AreaCascader from './AreaDropdown'

export default {
  components: {
    AreaCascader
  },
  props: {
    value: [String, Array, Number],
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 部分组件位置偏，弹出窗容易遮盖，设置true时，可实时调整位置
    adjustment: false,
    // 深度搜索，默认第一次只加载省的数据。市区的数据不加载，deep为true时，再加载市数据，一般搜索的时候有用
    deep: {
      type: Boolean,
      deep: false
    },
    onChange: Function
  },
  data () {
    return {
      // 正在装载地图数据
      loading: true,
      // 装载数据索引标记
      rqaIndex: 0,
      // 装载任务编号
      rqafId: '',
      areaData: [],
      selected: []
    }
  },
  watch: {
    value (newValue) {
      if (typeof newValue === 'object' && newValue.join('') !== this.selected.join('') && newValue.length > 0) {
        this.selected = newValue
      } else if (!newValue || newValue.length === 0) {
        this.selected = []
      } else if ((typeof newValue === 'number' || typeof newValue === 'string') && newValue) {
        // this.forceLoad()
        this.selected = areas.getPathByCode(newValue).map((item) => item.code)
        this.$emit('input', this.selected)
      }
    }
  },
  created () {
    // const vm = this
    const data = areas.getAllRoots().map((item) => {
      return {
        value: item.code,
        label: item.name,
        children: [],
        loading: false,
        hasChild: true
      }
    })

    // if (this.deep) {
    //   // 先让页面渲染完，在更新数据，防止进入页面很慢
    //   let length = data.length
    //   const allLoad = function () {
    //     let province = data[vm.rqaIndex]
    //     let children = vm.loadNext(province.value, true)
    //     if (children.length > 0) {
    //       province.children = children
    //     }
    //     vm.rqaIndex++
    //     if (vm.rqaIndex < length) {
    //       vm.rqafId = requestAnimationFrame(allLoad)
    //     } else {
    //       vm.resetAnimation()
    //     }
    //   }
    //   vm.rqafId = requestAnimationFrame(allLoad)
    // }
    this.areaData = data
  },
  mounted () {
    if (this.value && (typeof this.value === 'string' || typeof this.value === 'number')) {
      this.selected = areas.getPathByCode(this.value).map((item) => item.code)
    }
  },
  methods: {
    // 不等延迟执行加载数据，强行加载所有数据，会有点慢
    // forceLoad () {
    //   if (this.loading) {
    //     // 取消执行
    //     if (this.deep) {
    //       cancelAnimationFrame(this.rqafId)
    //     }
    //     let length = this.areaData.length
    //     while (this.rqaIndex < length) {
    //       let province = this.areaData[this.rqaIndex]
    //       let children = this.loadNext(province.value, true)
    //       if (children.length > 0) {
    //         province.children = children
    //       }
    //       this.rqaIndex++
    //     }
    //     this.resetAnimation()
    //   }
    // },
    resetAnimation () {
      this.rqaIndex = 0
      this.rqafId = null
      this.loading = false
    },
    loadData (item, callback) {
      item.loading = true
      const children = this.loadNext(item.value)
      if (children.length > 0) {
        item.children = children
      }
      item.loading = false
      callback()
    },
    loadNext (value, deep = false) {
      const vm = this
      return areas.getAllChild(value).map(item => {
        let data = {
          value: item.code,
          label: item.name,
          parent: item.parent
        }
        if (item.hasChild && item.hasChild === '1') {
          data.children = []
          data.loading = false
          data.hasChild = true
        }
        if (item.hasChild && item.hasChild === '1' && deep) {
          data.children = vm.loadNext(item.code)
        }
        return data
      })
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
