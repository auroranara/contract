import request from '@/utils/request'

export function getSubjectByName(name) {
  return request({
    url: '/api/resSubject/subjects',
    method: 'get',
    params: {
      name: name
    }
  })
}
export function getEnableSubject() {
  return request({
    url: '/api/resSubject/subjects/enable',
    method: 'get'
  })
}

export function getEnableLine() {
  return request({
    url: '/api/resSubject/line/enable',
    method: 'get'
  })
}

export function getAllLineAndStation() {
  return request({
    url: '/api/resSubject/line/all',
    method: 'get'
  })
}

export function getAuthSubject(psnId) {
  return request({
    url: '/api/resSubject/subjects/auth',
    method: 'get',
    params: {
      psnId: psnId
    }
  })
}
export function add(data) {
  return request({
    url: '/api/resSubject/add',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/api/resSubject/edit',
    method: 'post',
    data
  })
}
export function changeStatus(data) {
  return request({
    url: '/api/resSubject/status',
    method: 'post',
    params: {
      id: data.id,
      enabled: data.enabled
    }
  })
}
export function getLines() {
  return request({
    url: '/api/resSubject/line',
    method: 'get'
  })
}
export function getAllStation() {
  return request({
    url: '/api/resSubject/stations',
    method: 'get'
  })
}
export function getStations(lineId) {
  return request({
    url: '/api/resSubject/station/' + lineId,
    method: 'get'
  })
}

export function findConstructionCompany(lineId) {
  return request({
    url: '/api/resSubject/station/' + lineId + '/construction',
    method: 'get'
  })
}

export default {
  getSubjectByName,
  getEnableSubject,
  getEnableLine,
  getAuthSubject,
  add,
  edit,
  changeStatus,
  getLines,
  getStations,
  getAllStation
}
