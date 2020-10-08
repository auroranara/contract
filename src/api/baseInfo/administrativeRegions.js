import request from '@/utils/request'

// 获取行政区域列表（分页）
export function fetchListByPage(params) {
  return request({
    url: '/api/systemAdministrativeArea/pageList',
    method: 'get',
    params
  })
}

// 获取行政区域列表（全部）
export function fetchList() {
  return request({
    url: '/api/systemAdministrativeArea',
    method: 'get'
  })
}

// 获取行政区域详情
export function fetchDetail(params) {
  return request({
    url: `/api/systemAdministrativeArea/${params.id}`,
    method: 'get'
  })
}
