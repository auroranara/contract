import request from '@/utils/request'

// 获取税率列表（分页）
export function fetchListByPage(params) {
  return request({
    url: '/api/systemTax/pageList',
    method: 'get',
    params
  })
}

// 获取税率列表（全部）
export function fetchList() {
  return request({
    url: '/api/systemTax',
    method: 'get'
  })
}

// 获取税率详情
export function fetchDetail(params) {
  return request({
    url: `/api/systemTax/${params.id}`,
    method: 'get'
  })
}
