/**
 * 级联菜单冗余一份市级区的选择
 * @Author: mayousheng:Y010220
 * @Date: 2018-10-10 18:14:49
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-10-10 18:15:10
 */

import { Cascader } from 'iview'

export default {
  mixins: [Cascader],
  computed: {
    querySelections () {
      let selections = []
      function getSelections (arr, label, value) {
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i]
          item.__label = label ? label + ' / ' + item.label : item.label
          item.__value = value ? value + ',' + item.value : item.value
          if (item.children && item.children.length) {
            // 冗余一份市的可选数据
            if (item.parent) {
              selections.push({
                label: item.__label,
                value: item.__value,
                display: item.__label,
                item: item,
                disabled: !!item.disabled
              })
            }
            getSelections(item.children, item.__label, item.__value)

            delete item.__label
            delete item.__value
          } else {
            selections.push({
              label: item.__label,
              value: item.__value,
              display: item.__label,
              item: item,
              disabled: !!item.disabled
            })
          }
        }
      }
      getSelections(this.data)
      selections = selections.filter(item => {
        return item.label ? item.label.indexOf(this.query) > -1 : false
      }).map(item => {
        item.display = item.display.replace(new RegExp(this.query, 'g'), `<span>${this.query}</span>`)
        return item
      })
      return selections
    }
  }
}
