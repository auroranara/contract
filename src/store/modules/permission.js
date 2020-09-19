import { constantRouterMap } from '@/router/routers'
import Layout from '@/layout/index'

const permission = {
  state: {
    routers: constantRouterMap,
    showRouters: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_SHOW_ROUTERS: (state, routers) => {
      state.showRouters = routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, asyncRouter) {
      commit('SET_ROUTERS', asyncRouter)
    },
    SetShowRoutes({ commit }, asyncRouter) {
      commit('SET_SHOW_ROUTERS', asyncRouter)
    }
  }
}

// export const filterAsyncRouter = (routers) => {
//   // 遍历后台传来的路由字符串，转换为组件对象
//   // console.log(routers)
//
//   return routers.filter(router => {
//     if (router.component) {
//       if (router.component === 'Layout') { // Layout组件特殊处理
//         router.component = Layout
//       } else {
//         if (!router.children || router.children.length === 0) {
//           const component = router.component
//           router.component = loadView(component)
//         } else {
//           router.component = () => import('@/router/empty')
//         }
//       }
//     }
//     if (router.children && router.children.length > 0) {
//       router.children = filterAsyncRouter(router.children)
//     } else {
//       delete router['children']
//       delete router['redirect']
//     }
//     return true
//   })
// }
export function filterAsyncRouter(
  asyncRouterMap,
  lastRouter = false,
  type = false
) {
  return JSON.parse(JSON.stringify(asyncRouterMap)).filter(route => {
    // 处理 vue-router所需要路由 Empty（继承Empty模板的层）的children全部提到上一层
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    // 拼装路由
    if (lastRouter && route.path.indexOf('http') === -1) {
      route.path = lastRouter.path + '/' + route.path
      route.meta =
        (route.children && route.children.length) ||
        !lastRouter.redirect ||
        lastRouter.redirect === 'noredirect'
          ? route.meta
          : { ...route.meta, activeMenu: lastRouter.path }
    }

    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'Empty') {
        route.component = () => import(`@/router/empty`)
      } else if (route.component === 'RouterView') {
        route.component = () => import(`@/router/routerView`)
      } else {
        route.component = loadView(route.component) // route.component是一个字符串 这里是字符串转组件对象
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}
//
function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  JSON.parse(JSON.stringify(childrenMap)).forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'Empty') {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        childrenMap.splice(index, 1)
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
    }
    children = children.concat(el)
  })
  return children
}

export const loadView = view => {
  return () => import(`@/views/${view}`)
}

export default permission
