import request from '@/utils/request'

export function queryResources(data) {
  return request({
    url: '/api/resources/tree',
    method: 'get',
    data
  })
}

export function saveResource(data) {
  return request({
    url: '/api/resources',
    method: 'post',
    data
  })
}

export function delResource(resourceId) {
  return request({
    url: '/api/resources/' + resourceId,
    method: 'get',
    params: { resourceId }
  })
}

export function updateResource(data) {
  return request({
    url: '/api/resources/resource/' + data.id,
    method: 'post',
    data
  })
}
