import router from '@/router/routers'

/**
 * @param {Object} 个人工作台页面跳转
 * @param submitStatus 提交状态  0新增-保存  1新增-提交  2调整-保存 3调整-提交
 */
export default function jump({ billCode, billId, submitStatus }) {
  // 基础数据-客户
  if (billCode === 'CUSTOMER_BILL') {
    switch (submitStatus) {
      case 0:
        router.push({
          path: '/baseInfo/client/list',
          query: { type: 'add', id: billId }
        })
      case 1:
        router.push({
          path: '/baseInfo/client/list',
          query: { id: billId }
        })
      case 2:
        router.push({
          path: '/baseInfo/client/adjust',
          query: { id: billId }
        })
    }
  }
}
