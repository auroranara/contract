import request from '@/utils/request'

// 获取供应商列表（分页）
export function fetchListByPage(params) {
  return request({
    url: '/api/provider/pageList',
    method: 'get',
    params
  })
}

// 获取供应商列表（全部）
export function fetchList(params) {
  return request({
    url: '/api/provider',
    method: 'get',
    params
  })
}
