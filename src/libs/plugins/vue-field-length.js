/**
 * 系统字段的长度使用插件
 * @Author: mayousheng:Y010220
 * @Date: 2018-12-27 16:08:31
 * @Last Modified by:   Y010220
 * @Last Modified time: 2018-12-27 16:08:31
 */

import { FieldLength } from '../js/config'

const VueFieldLength = {}

VueFieldLength.install = (Vue, options) => {
  Vue.prototype.$fieldLength = {
    ...FieldLength
  }
}

export default VueFieldLength
