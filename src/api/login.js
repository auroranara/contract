import request from '@/utils/request'
export function login(userName, password) {
  return request({
    url: '/end/login/system',
    method: 'post',
    data: {
      userName,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/end/auth/info',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: '/end/auth/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/end/logout',
    method: 'post'
  })
}
