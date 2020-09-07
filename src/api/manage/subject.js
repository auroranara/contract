import request from '@/utils/request'

export function getSubjectByName(name) {
  return request({
    url: '/end/resSubject/subjects',
    method: 'get',
    params: {
      name: name
    }
  })
}
export function getEnableSubject() {
  return request({
    url: '/end/resSubject/subjects/enable',
    method: 'get'
  })
}

export function getEnableLine() {
  return request({
    url: '/end/resSubject/line/enable',
    method: 'get'
  })
}

export function getAllLineAndStation() {
  return request({
    url: '/end/resSubject/line/all',
    method: 'get'
  })
}

export function getAuthSubject(psnId) {
  return request({
    url: '/end/resSubject/subjects/auth',
    method: 'get',
    params: {
      psnId: psnId
    }
  })
}
export function add(data) {
  return request({
    url: '/end/resSubject/add',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/end/resSubject/edit',
    method: 'post',
    data
  })
}
export function changeStatus(data) {
  return request({
    url: '/end/resSubject/status',
    method: 'post',
    params: {
      id: data.id,
      enabled: data.enabled
    }
  })
}
export function getLines() {
  return request({
    url: '/end/resSubject/line',
    method: 'get'
  })
}
export function getAllStation() {
  return request({
    url: '/end/resSubject/stations',
    method: 'get'
  })
}
export function getStations(lineId) {
  return request({
    url: '/end/resSubject/station/' + lineId,
    method: 'get'
  })
}

export function findConstructionCompany(lineId) {
  return request({
    url: '/end/resSubject/station/'+lineId+'/construction',
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
