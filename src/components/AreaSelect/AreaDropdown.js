/**
 * 级联菜单冗余一份市级区的选择
 * @Author: mayousheng:Y010220
 * @Date: 2018-10-10 18:14:49
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-10-16 16:16:44
 */

import { Cascader } from 'iview'
import cityUtil, { searchByNameForCasecader } from '@/libs/js/city'
export default {
  mixins: [Cascader],
  watch: {
    value (val) {
      this.prepareLoadData(val)
      this.currentValue = val
      if (!val.length) this.selected = []
    }
  },
  computed: {
    querySelections () {
      let selections = searchByNameForCasecader(this.query)
      return selections.map(item => {
        item.display = item.display.replace(new RegExp(this.query, 'g'), `<span>${this.query}</span>`)
        return item
      })
    }
  },
  methods: {
    // 选中下拉框选项
    handleSelectItem (index) {
      const item = this.querySelections[index]
      if (item.item.disabled) return false
      this.query = ''
      this.$refs.input.currentValue = ''
      const oldVal = JSON.stringify(this.currentValue)
      let currentValue = item.value.split(',')
      let paths = cityUtil.getPathByCode(currentValue[currentValue.length - 1]).map(it => it.code)
      this.prepareLoadData(paths)
      this.currentValue = paths
      this.emitValue(this.currentValue, oldVal)
      this.handleClose()
    },
    /**
     * 检测data对应的是否已经加载过子数据
     * @param {*} paths
     */
    prepareLoadData (paths) {
      let selectedArea = this.data.find((dt) => {
        return dt.value === paths[0]
      })
      if (selectedArea.hasChild && selectedArea.children.length === 0) {
        const data = this.$parent.loadNext(selectedArea.value, true)
        selectedArea.children = data
      }
    }
  }
}
