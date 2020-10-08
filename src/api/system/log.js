import request from '@/utils/request'

export function getSystemLogs(data) {
  return request({
    url: '/api/systemLogs',
    method: 'get',
    params: {
      page: data.page,
      limit: data.limit,
      userName: data.userName,
      desc: data.desc,
      startDate: data.startDate,
      endDate: data.endDate
    }
  })
}

export default { getSystemLogs }
