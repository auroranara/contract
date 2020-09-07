import request from '@/utils/request'

export function getSystemLogs(data) {
  return request({
    url: '/end/systemLogs',
    method: 'get',
    params: {
      'page': data.page,
      'limit': data.limit,
      'userName': data.userName,
      'desc': data.desc,
      'startDate': data.startDate,
      'endDate': data.endDate
    }
  })
}

export default { getSystemLogs }
