import request from '@/utils/request'

// 获取个人工作台数据（dealType  -- 处理状态  1待办  2待阅  3已办  4已阅）
export function fetchTaskFlowList(params) {
  return request({
    url: '/api/taskFlow/pageList',
    method: 'get',
    params
  })
}
