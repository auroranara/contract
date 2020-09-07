import request from '@/utils/request'

export function del(ids) {
  return request({
    url: '/end/pictures',
    method: 'delete',
    data: ids
  })
}

export function sync() {
  return request({
    url: '/end/pictures/synchronize',
    method: 'post'
  })
}

export default { del, sync }
