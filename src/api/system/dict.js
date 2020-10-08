import request from '@/utils/request'

export function getDicts(data) {
  return request({
    url: '/api/dicts',
    method: 'get',
    params: { name: data.name, page: data.page, limit: data.limit }
  })
}

export function addDict(data) {
  return request({
    url: '/api/dicts',
    method: 'post',
    data
  })
}

export function delDict(id) {
  return request({
    url: '/api/dicts/' + id,
    method: 'get'
  })
}

export function editDict(data) {
  return request({
    url: '/api/dicts/dict',
    method: 'post',
    data
  })
}
