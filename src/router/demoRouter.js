// 模拟后端返回的路由
export const userMenuVos = [
  {
    path: '/personnel',
    component: 'Layout',
    name: 'personnel',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '个人中心', icon: 'dashboard' },
    children: [
      {
        path: 'todo',
        component: 'demo/form',
        name: 'todo',
        meta: { title: '我的待办' }
      },
      {
        path: 'done',
        component: 'demo/form',
        name: 'done',
        meta: { title: '我的已办' }
      },
      {
        path: 'task',
        component: 'demo/form',
        name: 'task',
        meta: { title: '我的任务' }
      }
    ]
  },
  {
    path: '/baseInfo',
    component: 'Layout',
    name: '基础数据',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '基础数据', icon: 'dashboard' },
    children: [
      {
        path: 'supplier',
        component: 'demo/form',
        name: 'supplier',
        meta: { title: '供应商' }
      },
      {
        path: 'client',
        component: 'demo/form',
        name: 'client',
        meta: { title: '客户' }
      },
      {
        path: 'constractType',
        component: 'demo/form',
        name: 'constractType',
        meta: { title: '合同分类' }
      },
      {
        path: 'valueSet',
        component: 'demo/form',
        name: 'valueSet',
        meta: { title: '值集管理' }
      },
      {
        path: 'organization',
        component: 'demo/form',
        name: 'organization',
        meta: { title: '组织' }
      }
    ]
  }
]
