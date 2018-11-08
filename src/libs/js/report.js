import Vue from 'vue'

const env = process.env.NODE_ENV
const install = (Vue) => {
  let timers = {}

  function getComponentNameOrRoutePath (vm) {
    if (!vm.$options) return
    return vm.$options.name ? ('component: ' + vm.$options.name) : ('route: ' + vm.$route.path)
  }

  Vue.mixin({
    // 当标记属性__timing__为true时，自动上报该组件的渲染与挂载事件
    created () {
      if (this.$options.__timing__) {
        this.$options.timerName = this.$options.name || Math.random().toString(32).substr(2, 10)
        timers[this.$options.timerName] = new Date().getTime()
      }
    },
    mounted () {
      if (this.$options.__timing__) {
        const endTimestamp = new Date().getTime()
        const name = this.$options.timerName
        this.$ga.time(
          'domRender',
          getComponentNameOrRoutePath(this),
          endTimestamp - timers[name],
          this.$route.path
        )
        if (env !== 'production') {
          console.log(`render time: ${getComponentNameOrRoutePath(this)} —> ${endTimestamp - timers[name]}`)
        }
        delete timers[name]
        delete this.$options.timerName
      }
    }
  })

  /**
   * 上报指令
   * 上报一个基础点击事件 v-report:click=" 'name' " 或 v-report:click.base=" 'name' "
   * 上报一个用户事件 v-report:click.user="[ 'name', 'label', value ]"
   * 上报一个自定义事件 v-report:click.event="[ 'name', 'label', value, 'category' ]"
   * 同时上报多个事件 v-report:click.base.user.event="[ 'name', 'label', value, 'category' ]"
   */
  Vue.directive('report', {
    bind (el, binding, vnode) {
      if (binding.arg !== 'click') return
      console.log(binding.modifiers, binding.value)
      const modifiers = binding.modifiers
      const value = binding.value

      if ((!modifiers.user && !modifiers.event) || modifiers.base) {
        vnode.context.$reportClick(typeof value === 'string' ? value : value[0])
      }
      if (modifiers.user) {
        vnode.context.$reportUser(...binding.value)
      }
      if (modifiers.event) {
        vnode.context.$reportEvent(...binding.value)
      }
    }
  })

  /**
   * 对一段代码开始计时
   * @param {String} name 操作名称
   */
  Vue.prototype.$timeStart = Vue.$timeStart = function (name) {
    if (!name) return
    const timerName = [this.$options.name, name].join('__')
    timers[timerName] = new Date().getTime()
  }

  /**
   * 对一段代码结束计时并上报
   * @param {String} name 操作名称，须与希望结束并上报的操作名称相同，如果找不到该操作将不进行上报也不抛错
   * @param {Boolean} isUserInfo 该计时是否与用户相关，相关则作为用户计时上报
   */
  Vue.prototype.$timeEnd = Vue.$timeEnd = function (name, isUserInfo) {
    if (!name) return
    const endTimestamp = new Date().getTime()
    const timerName = [this.$options.name, name].join('__')
    if (!timers[timerName]) return
    this.$ga.time(
      isUserInfo ? 'userInfo' : 'performance',
      name,
      endTimestamp - timers[timerName],
      getComponentNameOrRoutePath(this)
    )
  }

  /**
   * 上报一个点击事件，该事件分类为'click'，上报时会自动获取该事件所处的组件名(如果存在name)或路由
   * @param {String} name 点击事件名称
   */
  Vue.prototype.$reportClick = Vue.$reportClick = function (name) {
    if (!name) return
    this.$ga.event('click', name, getComponentNameOrRoutePath(this))
  }

  /**
   * 上报一个用户相关事件，该事件分类为'userInfo'
   * @param {String} name 事件名称
   * @param {String} label 事件说明，如果为空会自动获取该事件所处的组件名(如果存在name)或路由
   * @param {Number} value 事件值，需要是大于0的整数
   */
  Vue.prototype.$reportUser = Vue.$reportUser = function (name, label, value) {
    if (!name) return
    this.$ga.event('userInfo', name, label || getComponentNameOrRoutePath(this), value)
  }

  /**
   * 上报一个自定义事件，该事件分类默认为事件所处的组件名(如果存在name)或路由
   * @param {String} name 事件名称
   * @param {String} label 事件说明，可以为空
   * @param {Number} value 事件值，需要是大于0的整数
   * @param {String} category 事件分类，如果传入则会覆盖默认的事件分类
   */
  Vue.prototype.$reportEvent = Vue.$reportEvent = function (name, label, value, category) {
    if (!name) return
    this.$ga.event(category || getComponentNameOrRoutePath(this), name, label, value)
  }

  /**
   * 上报异常
   * @param {Error | String} error 异常对象或错误描述
   */
  Vue.prototype.$reportError = Vue.$reportError = function (error) {
    if (env !== 'production') console.error(error)
    const msg = (typeof error === 'string')
      ? error
      : (error instanceof Error)
        ? error.message
        : void 0
    if (!msg) return
    const temp = getComponentNameOrRoutePath(this)
    this.$ga.exception(`msg: ${msg} || userAgent: ${window.navigator.userAgent}${temp ? (' || ' + temp) : ''}`)
  }
}

Vue.use({ install })
