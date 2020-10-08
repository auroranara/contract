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
    url: `/api/unit/${params.id}`,
    method: 'get'
  })
}

// 新增值集（saveType 1 保存 2调整提交 新增不传）
export function addValueSet(data) {
  return request({
    url: '/api/unit/save',
    method: 'post',
    data
  })
}

// 删除值集
export function deleteValueSet(params) {
  return request({
    url: `/api/unit/${params.id}`,
    method: 'post'
  })
}

// 获取值集调整详情
export function fetchAdjustDetail(params) {
  return request({
    url: `/api/unit/adjust/${params.id}`,
    method: 'get'
  })
}
