import router from './routers'
import store from '@/store'
import Config from '@/settings'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { filterAsyncRouter } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title
  }
  NProgress.start()
  if (getToken()) {
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.menus.length === 0) {
        // 判断当前用户是否已拉取完user_info信息
        var user = JSON.parse(sessionStorage.getItem('user'))
        var codes = JSON.parse(sessionStorage.getItem('codes'))
        if (user && user.userMenuVos.length > 0) {
          store.dispatch('setUserMenus', user.userMenuVos)
          store.dispatch('setUserCodes', codes)
          const asyncRouter = filterAsyncRouter(user.userMenuVos, false, true)
          const showRouter = filterAsyncRouter(user.userMenuVos)
          asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
          store.dispatch('GenerateRoutes', asyncRouter).then(() => {
            // 存储路由
            router.addRoutes(asyncRouter) // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
          store.dispatch('SetShowRoutes', showRouter)
        } else {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        }
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
