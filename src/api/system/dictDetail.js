import request from '@/utils/request'

export function getDictDetails(dictId) {
  return request({
    url: '/api/dicts/' + dictId + '/detail',
    method: 'get'
  })
}

export function getDictMap(dictName) {
  const params = {
    dictName,
    page: 0,
    size: 9999
  }
  return request({
    url: '/api/dictDetail/map',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/api/dicts/detail',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/api/dicts/detail/' + id,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: '/api/dicts/dict/' + data.id,
    method: 'post',
    data
  })
}

export function getDictRedis(name) {
  return request({
    url: '/api/dicts/detail/redis',
    method: 'get',
    params: { name: name }
  })
}

export default { add, edit, del }
