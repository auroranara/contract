import request from '@/utils/request'

export function queryResources(data) {
  return request({
    url: '/end/resources/tree',
    method: 'get',
    data
  })
}

export function saveResource(data) {
  return request({
    url: '/end/resources',
    method: 'post',
    data
  })
}

export function delResource(resourceId) {
  return request({
    url: '/end/resources/' + resourceId,
    method: 'get',
    params: { resourceId }
  })
}

export function updateResource(data) {
  return request({
    url: '/end/resources/resource/' + data.id,
    method: 'post',
    data
  })
}

