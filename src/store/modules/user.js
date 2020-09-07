import { login, getInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    menus: [],
    // 第一次加载菜单时用到
    loadMenus: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.userName, userInfo.password).then(res => {
          setToken(res.data.token)
          commit('SET_TOKEN', res.data.token)
          commit('SET_ROLES', res.data.codes)
          sessionStorage.setItem('codes', JSON.stringify(res.data.codes))
          // commit('SET_MENUS', res.userMenuVos)
          setUserInfo(res.data, commit)
          sessionStorage.setItem('user', JSON.stringify(res.data))
          // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
          commit('SET_LOAD_MENUS', true)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          logOut(commit)
          resolve()
        }).catch(error => {
          logOut(commit)
          reject(error)
        })
      })
    },

    LogOutWithoutLogin({ commit }) {
      return new Promise((resolve, reject) => {
        logOut(commit)
        resolve()
      })
    },

    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    },
    setUserMenus({ commit }, userMenus) {
      return new Promise((resolve, reject) => {
        commit('SET_MENUS', userMenus)
      })
    },
    setUserCodes({ commit }, codes) {
      return new Promise((resolve, reject) => {
        commit('SET_ROLES', codes)
      })
    }
  }
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  commit('SET_ROLES', [])
  removeToken()
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.codes.length === 0) {
    commit('SET_ROLES', [])
  } else {
    commit('SET_ROLES', res.codes)
  }
  commit('SET_USER', res)
}

export default user
