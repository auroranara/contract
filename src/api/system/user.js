import request from '@/utils/request'

export function userList(data) {
  return request({
    url: '/api/users',
    method: 'get',
    params: {
      psnId: data.psnId,
      mobile: data.mobile,
      lineId: data.lineId,
      stationId: data.stationId,
      type: data.type,
      page: data.page,
      limit: data.limit
    }
  })
}

export function saveUser(data) {
  return request({
    url: '/api/users',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/api/users/user',
    method: 'post',
    data
  })
}

export function updateSubject(data) {
  return request({
    url: '/api/users/subject',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/api/users/pwd',
    method: 'post',
    data
  })
}
