import request from '@/utils/request'

// 获取客户列表（分页）
export function fetchListByPage(params) {
  return request({
    url: '/api/customer/pageList',
    method: 'get',
    params
  })
}

// 获取客户列表（全部）
export function fetchList() {
  return request({
    url: '/api/customer',
    method: 'get'
  })
}

// 获取客户详情
export function fetchDetail(params) {
  return request({
    url: `/api/customer/${params.id}`,
    method: 'get'
  })
}

// 删除客户
export function deleteClient(params) {
  return request({
    url: `/api/customer/${params.id}`,
    method: 'post'
  })
}

// 获取客户调整详情
export function fetchAdjustDetail(params) {
  return request({
    url: `/api/customer/adjust/${params.id}`,
    method: 'get'
  })
}

// 新增值集
export function addClient(data) {
  return request({
    url: '/api/customer/save',
    method: 'post',
    data
  })
}
