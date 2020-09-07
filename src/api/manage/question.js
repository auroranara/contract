import request from '@/utils/request'

export function getSubjectQuestionList(data) {
  return request({
    url: '/end/subjectFrequency/list',
    method: 'get',
    params: data
  })
}
export function getDetail(id) {
  return request({
    url: '/end/subjectFrequency/detail/' + id,
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: '/end/subjectFrequency/add',
    method: 'post',
    data
  })
}
export function edit(data) {
  return request({
    url: '/end/subjectFrequency/edit',
    method: 'post',
    data
  })
}
export function changeStatus(data) {
  return request({
    url: '/end/subjectFrequency/changeStatus',
    method: 'post',
    params: {
      'id': data.id,
      'enabled': data.enabled
    }
  })
}

export default { getSubjectQuestionList, add, edit, changeStatus }
