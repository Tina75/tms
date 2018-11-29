import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import VueAnalytics from 'vue-analytics'

const isProdEnv = process.env.NODE_ENV === 'production'
let tabsCache = []

// 使用GA
Vue.use(VueAnalytics, {
  id: 'UA-128241354-1',
  router,
  set: [ { field: 'hostname', value: window.location.origin } ],
  debug: {
    sendHitTask: isProdEnv
  },
  autoTracking: {
    exception: true, // 对于没有被vue errorHandler捕获的异常进行上报
    exceptionLogs: !isProdEnv, // 异常log打印
    // 优化tab切换与相同query的PV计算方式
    shouldRouterUpdate (to, from) {
      // 将当前的tabsCache备份并更新当前tabsCache
      const tabsCacheTemp = Object.assign([], tabsCache)
      tabsCache = Object.assign([], store.getters.TabNavList)
      // 所有页面刷新不计入PV
      if (to.path === from.path) return false
      // 首页PV不校验是否tab已存在和query是否改变
      if (to.path === '/home') return true
      // 如果当前不存在tabsCacheTemp则更新PV
      if (!tabsCacheTemp.length) return true
      // 校验tabsCacheTemp中是否存在相同path，不存在则更新PV
      const equallyPathTabs = checkExistEquallyPath(tabsCacheTemp, to.path)
      if (!equallyPathTabs) return true
      // 存在相同path的tabs，则校验query是否相同，不相同则更新
      return !checkExistEquallyQuery(equallyPathTabs, to.query)
    },
    transformQueryString: false
  }
})

/**
  * 校验是否存在相同path的tab，如果存在则返回相同的tab信息，不存在则返回false
  * @param {Array} tabs 上一次缓存下来的页面信息
  * @param {String} toPagePath to.path
  * @returns {Array | Boolean}
  */
function checkExistEquallyPath (tabs, toPagePath) {
  const samePathTabs = []
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].path === toPagePath) samePathTabs.push(tabs[i])
  }
  return samePathTabs.length ? samePathTabs : false
}

/**
 * 当存在路径相同的页面时，比较已存在页面与目标页面的query是否相同
 * @param {Array} equallyPathTabs 与to.path相同path的tab信息
 * @param {Object} toPageQuery to.query
 * @returns {Boolean}
 */
function checkExistEquallyQuery (equallyPathTabs, toPageQuery) {
  return equallyPathTabs.every(item => {
    const equallyPathQuery = item.query
    let equally = true // 标记是否每一项都不同，默认相同
    for (let key in equallyPathQuery) {
      if (equallyPathQuery[key] !== toPageQuery[key]) equally = false
    }
    return equally
  })
}

const install = (Vue) => {
  let timers = {}

  function getComponentNameOrRoutePath (vm) {
    if (!vm.$options) {
      return 'route: ' + window.location.hash.split('?')[0].replace('#', '')
    } else {
      return vm.$options.name ? ('component: ' + vm.$options.name) : ('route: ' + vm.$route.path)
    }
  }

  Vue.mixin({
    // 当标记属性__timing__为true时，自动上报该组件的渲染与挂载耗时
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
        if (!isProdEnv) {
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
      const modifiers = binding.modifiers
      const value = binding.value

      if ((!modifiers.user && !modifiers.event) || modifiers.base) {
        vnode.context.$reportClick(typeof value === 'string' ? value : value[0])
      }
      if (modifiers.user) {
        if (!(binding.value instanceof Array)) {
          throw new Error('用户类型上报指令的值必须是数组')
        }
        vnode.context.$reportUser(...binding.value)
      }
      if (modifiers.event) {
        if (!(binding.value instanceof Array)) {
          throw new Error('自定义类型上报指令的值必须是数组')
        }
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
    const timerName = [this.$options ? this.$options.name : '', name].join('__')
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
    const timerName = [this.$options ? this.$options.name : '', name].join('__')
    if (!timers[timerName]) return
    if (!isProdEnv) {
      console.log(`execute time: ${name} —> ${endTimestamp - timers[timerName]}`)
    }
    this.$ga.time(
      isUserInfo ? 'userInfo' : 'performance',
      name,
      endTimestamp - timers[timerName],
      getComponentNameOrRoutePath(this)
    )
  }

  /**
   * 上报一个点击事件，该事件分类为'click'，上报时会自动获取该事件所处的组件名(如果存在name)或路由path
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
    const temp = getComponentNameOrRoutePath(this)
    this.$ga.event(category || (temp || 'unset_category'), name, label, value)
  }

  /**
   * 上报异常
   * @param {Error | String} error 异常对象或错误描述
   */
  Vue.prototype.$reportError = Vue.$reportError = function (error) {
    if (!isProdEnv) console.error(error)
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
