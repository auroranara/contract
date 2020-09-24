import request from '@/utils/request'

// 获取值集列表（分页）
export function fetchListByPage(params) {
  return request({
    url: '/api/unit/pageList',
    method: 'get',
    params
  })
}

// 获取值集列表（全部）
export function fetchList() {
  return request({
    url: '/api/unit',
    method: 'get'
  })
}

// 获取值集详情
export function fetchDetail(params) {
  return request({
    url: `/api/unit/${params.unitId}`,
    method: 'get'
  })
}
