import request from '@/utils/request'

export function resetEmail(data) {
  return request({
    url: '/end/code/resetEmail',
    method: 'post',
    data
  })
}

export function updatePass(pass) {
  return request({
    url: '/end/users/updatePass/' + pass,
    method: 'get'
  })
}
