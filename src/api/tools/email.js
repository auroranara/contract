import request from '@/utils/request'

export function get() {
  return request({
    url: '/end/email',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: '/end/email',
    data,
    method: 'put'
  })
}

export function send(data) {
  return request({
    url: '/end/email',
    data,
    method: 'post'
  })
}
