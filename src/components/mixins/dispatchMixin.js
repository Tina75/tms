/**
 * 由于iview的输入框或选择性组件，需要验证
 * 每次值得变化都需要调用验证函数，来保证验证的正确性
 * 所以很多组件，都需要在值改变后做dispach，通知formitem，值变化后的校验回调
 * 所以这里统一抽出来dispatch 函数
 * @Author: mayousheng:Y010220
 * @Date: 2018-12-24 17:16:54
 * @Last Modified by: Y010220
 * @Last Modified time: 2018-12-24 17:18:20
 */

export default {
  methods: {
    dispatch (componentName, eventName, params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent
        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    }
  }
}
