import Vue from 'vue'
import Router from 'vue-router'
import PageRouter from './components/PageRouter.vue'
Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: __dirname,
  routes: [
    {
      path: '/:name/:name1/:name2',
      component: PageRouter
    },
    {
      path: '/:name/:name1',
      component: PageRouter
    },
    {
      path: '/:name',
      component: PageRouter
    },
    {
      path: '/',
      component: PageRouter
    }
  ]
})
