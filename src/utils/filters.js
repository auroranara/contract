const systemStatus = {
  1: '初始状态',
  2: '审批中',
  3: '审批完成',
  4: '已停用'
}

const statusDict = {
  1: '初始状态',
  2: '审批中',
  3: '审批完成',
  4: '已停用'
}

// 布尔判断输出文字
export const judgeFilter = value =>
  ([1, '1'].includes(value) && '是') || ([0, '0'].includes(value) && '否') || ''

// 系统信息状态
export const systemStatusFilter = value => systemStatus[value]

// 审批状态
export const statusFilter = value => statusDict[value]
