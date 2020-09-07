import request from '@/utils/request'

export function getAllJob(deptId) {
  const params = {
    deptId,
    page: 0,
    size: 9999
  }
  return request({
    url: '/end/job',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/end/job',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/end/job',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/end/job',
    method: 'put',
    data
  })
}

export default { add, edit, del }
