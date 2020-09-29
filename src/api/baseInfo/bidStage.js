import request from '@/utils/request'

// 获取标段列表（分页）
export function fetchListByPage(params) {
  return request({
    url: '/api/section/pageList',
    method: 'get',
    params
  })
}

// 获取标段列表（全部）
export function fetchList() {
  return request({
    url: '/api/section',
    method: 'get'
  })
}

// 获取标段详情
export function fetchDetail(params) {
  return request({
    url: `/api/section/${params.id}`,
    method: 'get'
  })
}
