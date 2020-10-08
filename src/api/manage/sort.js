import request from '@/utils/request'

export function getManContStandardByName(name) {
  return request({
    url: '/api/manContStandard/getManContStandardByName',
    method: 'get',
    params: {
      name: name
    }
  })
}
export function add(data) {
  return request({
    url: '/api/manContStandard/add',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/api/manContStandard/edit',
    method: 'post',
    data
  })
}
export function changeStatus(data) {
  return request({
    url: '/api/manContStandard/changeStatus',
    method: 'post',
    params: {
      id: data.id,
      enabled: data.enabled
    }
  })
}
export function getEnableList(data) {
  return request({
    url: '/api/manContStandard/enable',
    method: 'get'
  })
}
export function getManageCont(data) {
  return request({
    url: '/api/manContStandard/manageCont',
    method: 'get'
  })
}

export default {
  getManContStandardByName,
  add,
  edit,
  changeStatus,
  getEnableList,
  getManageCont
}
