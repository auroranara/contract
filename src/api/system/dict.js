import request from '@/utils/request'

export function getDicts(data) {
  return request({
    url: '/end/dicts',
    method: 'get',
    params: { 'name': data.name, 'page': data.page, 'limit': data.limit }
  })
}

export function addDict(data) {
  return request({
    url: '/end/dicts',
    method: 'post',
    data
  })
}

export function delDict(id) {
  return request({
    url: '/end/dicts/' + id,
    method: 'get'
  })
}

export function editDict(data) {
  return request({
    url: '/end/dicts/dict',
    method: 'post',
    data
  })
}
