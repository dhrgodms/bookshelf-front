import { defineRouter } from '#q-app/wrappers'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useLoggedIn } from 'src/stores/loggedIn'
// import api from '../boot/axios'
// import axios from '../boot/axios'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const loggedInState = useLoggedIn()

  // const createHistory = process.env.SERVER
  //   ? createMemoryHistory
  //   : process.env.VUE_ROUTER_MODE === 'history'
  //     ? createWebHistory
  //     : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createWebHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

    if (!requiresAuth) {
      next()
      return
    }

    const accessToken = localStorage.getItem('access')
    if (accessToken) {
      console.log('accesstoken in index.js: ' + accessToken)
      loggedInState.login()
      next()
    } else {
      loggedInState.logout()
      next('/login')
    }
  })

  return Router
})
