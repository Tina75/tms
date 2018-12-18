import router from './router'
import store from './store/index'
import { getToken, removeToken } from './libs/js/auth'

const whiteList = ['/login', '/register', '/findback']
/**
 * 路由监控
 */
router.beforeEach((to, from, next) => {
  // 存在token
  if (getToken()) {
    // 跳转路由如果是登陆页，就进入系统内部页面
    if (to.path === '/login') {
      if (to.query.from === 'shipper') {
        // 货主版注册了之后
        removeToken()
        next()
      } else {
        next({ path: '/home' })
      }
    } else {
      // 有无用户数据
      if (!store.getters.UserInfo.id && store.getters.Permissions.length === 0) {
        store.dispatch('getUserInfo')
          .then((data) => {
            // 默认先跳转到首页，防止0标签
            next({ path: '/home' })
          })
          .catch((er) => {
            // 后端异常
            // store.dispatch('logout')
            //   .then(() => {
            //     next({ path: '/login' })
            //   })
            next()
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
