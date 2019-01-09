/**
 * 系统字段的精度使用插件
 * 系统字段的长度使用插件
 * @Author: mayousheng:Y010220
 * @Date: 2018-12-27 16:08:31
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-12-27 19:05:35
 */

import { NumberPrecesion, FieldLength } from '../js/config'

const VueConfig = {}

VueConfig.install = (Vue, options) => {
  Vue.prototype.$fieldLength = {
    ...FieldLength
  }
  Vue.prototype.$numberPrecesion = {
    ...NumberPrecesion
  }
}

export default VueConfig
