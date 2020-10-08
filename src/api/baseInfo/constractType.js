import request from '@/utils/request'

// 获取合同分类列表（分页）
export function fetchListByPage(params) {
  return request({
    url: '/api/contractCategory/pageList',
    method: 'get',
    params
  })
}

// 获取列表（全部）
export function fetchList() {
  return request({
    url: '/api/contractCategory',
    method: 'get'
  })
}

// 获取详情
export function fetchDetail(params) {
  return request({
    url: `/api/contractCategory/${params.id}`,
    method: 'get'
  })
}

// 新增（saveType 1 保存 2调整提交 新增不传）
export function addConstractType(data) {
  return request({
    url: '/api/contractCategory/save',
    method: 'post',
    data
  })
}

// 删除
export function deleteConstractType(params) {
  return request({
    url: `/api/contractCategory/${params.id}`,
    method: 'post'
  })
}
