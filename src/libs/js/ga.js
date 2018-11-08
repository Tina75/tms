import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import VueAnalytics from 'vue-analytics'

let tabsCache = []

// 使用GA
Vue.use(VueAnalytics, {
  id: 'UA-128241354-1',
  router,
  set: [ { field: 'hostname', value: window.location.origin } ],
  autoTracking: {
    // 对于没有被vue errorHandler捕获的异常进行上报
    exception: true,
    exceptionLogs: process.env.NODE_ENV !== 'production', // 异常log打印
    debug: {
      enabled: process.env.NODE_ENV !== 'production'
    },
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
