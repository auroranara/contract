// 模拟后端返回的路由
export const userMenuVos = [
  {
    path: '/personnel',
    component: 'Layout',
    name: 'personnel',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '个人工作台', icon: 'dashboard' },
    children: [
      {
        path: 'backlog',
        component: 'features/develop',
        name: 'backlog',
        meta: { title: '待办事项' }
      },
      {
        path: 'done',
        component: 'features/develop',
        name: 'done',
        meta: { title: '已办事项' }
      },
      {
        path: 'toBeRead',
        component: 'features/develop',
        name: 'toBeRead',
        meta: { title: '待阅事项' }
      },
      {
        path: 'haveRead',
        component: 'features/develop',
        name: 'haveRead',
        meta: { title: '已阅事项' }
      },
      {
        path: 'myContract',
        component: 'features/develop',
        name: 'myContract',
        meta: { title: '我的合同' }
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
        component: 'features/develop',
        name: 'supplier',
        meta: { title: '供应商' }
      },
      {
        path: 'client',
        component: 'features/develop',
        name: 'client',
        meta: { title: '客户' }
      },
      {
        path: 'organization',
        component: 'features/develop',
        name: 'organization',
        meta: { title: '组织' }
      },
      {
        path: 'valueSet',
        component: 'features/develop',
        name: 'valueSet',
        meta: { title: '值集' }
      },
      {
        path: 'constractType',
        component: 'features/develop',
        name: 'constractType',
        meta: { title: '合同分类' }
      },
      {
        path: 'bidStage',
        component: 'features/develop',
        name: 'bidStage',
        meta: { title: '标段' }
      },
      {
        path: 'person',
        component: 'features/develop',
        name: 'person',
        meta: { title: '人员' }
      },
      {
        path: 'unit',
        component: 'features/develop',
        name: 'unit',
        meta: { title: '单位' }
      },
      {
        path: 'taxRate',
        component: 'features/develop',
        name: 'taxRate',
        meta: { title: '税率' }
      },
      {
        path: 'administrativeRegions',
        component: 'features/develop',
        name: 'administrativeRegions',
        meta: { title: '行政区域' }
      },
      {
        path: 'estimateType',
        component: 'features/develop',
        name: 'estimateType',
        meta: { title: '概算类型' }
      }
    ]
  },
  {
    path: '/project',
    component: 'Layout',
    name: 'project',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '项目管理', icon: 'dashboard' },
    children: [
      {
        path: 'projectInfo',
        component: 'features/develop',
        name: 'projectInfo',
        meta: { title: '项目信息' }
      }
    ]
  },
  {
    path: '/cost',
    component: 'Layout',
    name: 'cost',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '造价管理', icon: 'dashboard' },
    children: [
      {
        path: 'estimateFormulationStart',
        component: 'features/develop',
        name: 'estimateFormulationStart',
        meta: { title: '概算编制启动' }
      },
      {
        path: 'estimateDemandCollection',
        component: 'features/develop',
        name: 'estimateDemandCollection',
        meta: { title: '概算需求征集' }
      },
      {
        path: 'estimateDemandSummary',
        component: 'features/develop',
        name: 'estimateDemandSummary',
        meta: { title: '概算需求汇总' }
      },
      {
        path: 'estimateDemandFulfillment',
        component: 'features/develop',
        name: 'estimateDemandFulfillment',
        meta: { title: '概算需求落实情况' }
      },
      {
        path: 'estimateInfo',
        component: 'features/develop',
        name: 'estimateInfo',
        meta: { title: '概算信息' }
      },
      {
        path: 'budgetContrast',
        component: 'features/develop',
        name: 'budgetContrast',
        meta: { title: '估算对比表' }
      },
      {
        path: 'mergingEstimates',
        component: 'features/develop',
        name: 'mergingEstimates',
        meta: { title: '概算归并表' }
      },
      {
        path: 'finalAccountAudit',
        component: 'features/develop',
        name: 'finalAccountAudit',
        meta: { title: '决算送审表' }
      }
    ]
  },
  {
    path: '/bidding',
    component: 'Layout',
    name: 'bidding',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '招标管理', icon: 'dashboard' },
    children: [
      {
        path: 'contractPlanStart',
        component: 'features/develop',
        name: 'contractPlanStart',
        meta: { title: '合同策划启动' }
      },
      {
        path: 'contractPlan',
        name: 'contractPlan',
        component: 'bidding/contractPlan/list',
        meta: { title: '合同策划' },
        redirect: 'contractPlan/list'
        // children: [
        //   {
        //     path: 'list',
        //     component: 'features/develop',
        //     name: 'list',
        //     hidden: true,
        //     meta: { title: '合同策划列表' }
        //   },
        //   {
        //     path: 'form',
        //     component: 'bidding/contractPlan/form',
        //     name: 'form',
        //     hidden: true,
        //     meta: { title: '合同策划单' }
        //   }
        // ]
      },
      {
        path: 'contractPlan/form',
        component: 'bidding/contractPlan/form',
        name: 'form',
        hidden: true,
        meta: { title: '合同策划单' }
      },
      {
        path: 'biddingPlanStart',
        component: 'features/develop',
        name: 'biddingPlanStart',
        meta: { title: '招标计划启动' }
      },
      {
        path: 'biddingPlan',
        component: 'features/develop',
        name: 'biddingPlan',
        meta: { title: '招标计划' }
      },
      {
        path: 'controlPrice',
        component: 'features/develop',
        name: 'controlPrice',
        meta: { title: '控制价' }
      },
      {
        path: 'biddingfileFormulation',
        component: 'features/develop',
        name: 'biddingfileFormulation',
        meta: { title: '招标文件编制' }
      },
      {
        path: 'competitiveNegotiationfileFormulation',
        component: 'features/develop',
        name: 'competitiveNegotiationfileFormulation',
        meta: { title: '竞争性谈判文件编制' }
      },
      {
        path: 'biddingResult',
        component: 'features/develop',
        name: 'biddingResult',
        meta: { title: '招标成果' }
      },
      {
        path: 'competitiveNegotiationResult',
        component: 'features/develop',
        name: 'competitiveNegotiationResult',
        meta: { title: '竞争性谈判成果' }
      },
      {
        path: 'negotiationResult',
        component: 'features/develop',
        name: 'negotiationResult',
        meta: { title: '谈判成果' }
      }
    ]
  },
  {
    path: '/contract',
    component: 'Layout',
    name: 'contract',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '合同管理', icon: 'dashboard' },
    children: [
      {
        path: 'contractFileFormulation',
        component: 'features/develop',
        name: 'contractFileFormulation',
        meta: { title: '合同文件编制' }
      },
      {
        path: 'signAndConfirm',
        component: 'features/develop',
        name: 'signAndConfirm',
        meta: { title: '合同签字确认' }
      },
      {
        path: 'contractInfo',
        component: 'features/develop',
        name: 'contractInfo',
        meta: { title: '合同信息' }
      },
      {
        path: 'contractAmendment',
        component: 'features/develop',
        name: 'contractAmendment',
        meta: { title: '合同修正' }
      },
      {
        path: 'contractMeasurement',
        component: 'features/develop',
        name: 'contractMeasurement',
        meta: { title: '合同计量' }
      },
      {
        path: 'paymentInfo',
        component: 'features/develop',
        name: 'paymentInfo',
        meta: { title: '付款信息' }
      },
      {
        path: 'billingInfo',
        component: 'features/develop',
        name: 'billingInfo',
        meta: { title: '开票信息' }
      },
      {
        path: 'incomeInfo',
        component: 'features/develop',
        name: 'incomeInfo',
        meta: { title: '收款信息' }
      },
      {
        path: 'contractSettlement',
        component: 'features/develop',
        name: 'contractSettlement',
        meta: { title: '合同结算' }
      },
      {
        path: 'contractClosure',
        component: 'features/develop',
        name: 'contractClosure',
        meta: { title: '合同关闭' }
      }
    ]
  },
  {
    path: '/template',
    component: 'Layout',
    name: 'template',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '模板管理', icon: 'dashboard' },
    children: [
      {
        path: 'biddingfileTemplate',
        component: 'features/develop',
        name: 'biddingfileTemplate',
        meta: { title: '招标文件模板' }
      },
      {
        path: 'competitiveNegotiationTemplate',
        component: 'features/develop',
        name: 'competitiveNegotiationTemplate',
        meta: { title: '竞争性谈判文件模板' }
      },
      {
        path: 'contractFileTemplate',
        component: 'features/develop',
        name: 'contractFileTemplate',
        meta: { title: '合同文件模板' }
      }
    ]
  },
  {
    path: '/transfer',
    component: 'Layout',
    name: 'transfer',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '移交管理', icon: 'dashboard' },
    children: [
      {
        path: 'spareParts',
        component: 'features/develop',
        name: 'spareParts',
        meta: { title: '备品备件移交' }
      },
      {
        path: 'equipmentAndFacilities',
        component: 'features/develop',
        name: 'equipmentAndFacilities',
        meta: { title: '设备设施移交' }
      }
    ]
  },
  {
    path: '/evaluation',
    component: 'Layout',
    name: 'evaluation',
    redirect: 'noredirect',
    alwaysShow: true,
    meta: { title: '评价管理', icon: 'dashboard' },
    children: [
      {
        path: 'internal',
        component: 'features/develop',
        name: 'internal',
        meta: { title: '内部评价' }
      },
      {
        path: 'supplier',
        component: 'features/develop',
        name: 'supplierEvaluation',
        meta: { title: '供应商评价' }
      },
      {
        path: 'customer',
        component: 'features/develop',
        name: 'customer',
        meta: { title: '客户评价' }
      }
    ]
  }
]
