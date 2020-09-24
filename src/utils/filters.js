// 布尔判断输出文字
export const judgeFilter = value =>
  ([1, '1'].includes(value) && '是') || ([0, '0'].includes(value) && '否') || ''
