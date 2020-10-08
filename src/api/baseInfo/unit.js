import request from '@/utils/request'

// 获取单位列表（分页）
export function fetchListByPage(params) {
  return request({
    url: '/api/systemUnit/pageList',
    method: 'get',
    params
  })
}

// 获取单位列表（全部）
export function fetchList() {
  return request({
    url: '/api/systemUnit',
    method: 'get'
  })
}
