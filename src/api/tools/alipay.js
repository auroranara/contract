import request from '@/utils/request'

export function get() {
  return request({
    url: '/end/aliPay',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: '/end/aliPay',
    data,
    method: 'put'
  })
}

// 支付
export function toAliPay(url, data) {
  return request({
    url: '/end/' + url,
    data,
    method: 'post'
  })
}
