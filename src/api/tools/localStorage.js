import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/end/localStorage',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/end/localStorage/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/end/localStorage',
    method: 'put',
    data
  })
}

export default { add, edit, del }
