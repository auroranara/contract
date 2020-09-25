import request from '@/utils/request'

// 获取概算类型列表（分页）
export function fetchListByPage(params) {
  return request({
    url: '/api/estimateType/pageList',
    method: 'get',
    params
  })
}

// 获取概算类型列表（全部）
export function fetchList() {
  return request({
    url: '/api/estimateType',
    method: 'get'
  })
}

// 获取概算类型详情
export function fetchDetail(params) {
  return request({
    url: `/api/estimateType/${params.id}`,
    method: 'get'
  })
}

// 新增概算类型
export function addValueSet(data) {
  return request({
    url: '/api/estimateType/save',
    method: 'post',
    data
  })
}

// 删除概算类型
export function deleteValueSet(params) {
  return request({
    url: `/api/estimateType/${params.id}`,
    method: 'post'
  })
}

// 获取值集调整详情
export function fetchAdjustDetail(params) {
  return request({
    url: `/api/estimateType/adjust/${params.id}`,
    method: 'get'
  })
}
