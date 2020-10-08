import request from '@/utils/request'
export function login(userName, password) {
  return request({
    url: '/api/login/system',
    method: 'post',
    data: {
      userName,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/api/auth/info',
    method: 'get'
  })
}

export function getCodeImg() {
  return request({
    url: '/api/auth/code',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
