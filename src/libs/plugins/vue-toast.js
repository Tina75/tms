/**
 * 系统全局提示确认框
 * @Author: mayousheng:Y010220
 * @Date: 2018-12-27 16:10:11
 * @Last Modified by:   Y010220
 * @Last Modified time: 2018-12-27 16:10:11
 */

import Toast from '@/components/toast'

const VueToast = {}

VueToast.install = (Vue, options) => {
  Vue.prototype.$Toast = Toast
}
export default VueToast
