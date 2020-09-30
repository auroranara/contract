<template>
  <div class="container">
    <div class="head-container">
      <el-button plain type="primary">审批</el-button>
      <el-button plain type="primary" @click="onSave('form')">保存</el-button>
      <el-button plain type="primary">提交</el-button>
      <el-button plain type="primary">删除</el-button>
      <el-button plain type="primary">模板下载</el-button>
      <el-button plain type="primary">导入</el-button>
      <el-button plain type="primary">导出</el-button>
    </div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="单据信息" name="form">
        <block-title title="信息"></block-title>
        <grid-form
          ref="gridForm"
          :rules="rules"
          :settings="settings"
          :model="form"
        ></grid-form>

        <block-title title="概算明细"></block-title>
      </el-tab-pane>
      <el-tab-pane label="系统信息" name="baseInfo">
        <system-info :data="systemData" />
      </el-tab-pane>
      <el-tab-pane label="审批信息" name="approval">
        <div class="timeline-container">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in timelineList"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
              >{{ activity.content }}</el-timeline-item
            >
          </el-timeline>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import GridForm from '@/components/GridForm'
import BlockTitle from '@/components/BlockTitle'
import SystemInfo from '@/components/SystemInfo'
import moment from 'moment'

export default {
  name: 'estimateInfoAdjustForm',
  components: {
    GridForm,
    BlockTitle,
    SystemInfo,
  },
  data() {
    return {
      activeName: 'form',
      form: {},
      systemData: {},
      rules: {
        bidName: [
          { required: true, message: '请输入标段名称', trigger: 'blur' },
        ],
        projectName: [
          { required: true, message: '请选择项目名称', trigger: 'blur' },
        ],
        jsx: [{ required: true, message: '请评分实时性', trigger: 'blur' }],
      },
      // 招标组织形式
      tenderOrganizationForms: [
        { value: '1', label: '自行招标' },
        { value: '2', label: '委托招标' },
      ],
      // 招标方式
      tenderMethods: [
        { value: '1', label: '公开招标' },
        { value: '2', label: '邀请招标' },
      ],
      settings: [
        [
          {
            type: 'label',
            label: '项目名称',
            field: 'xmmc',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'xmmc',
            tag: 'el-input',
            render: (data) => <el-input vModel={data['xmmc']} />,
          },
          {
            type: 'label',
            label: '项目编号',
            field: 'xmbh',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'xmbh',
            disabled: true,
            render: (data) => <el-input readonly vModel={data['xmmc']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '是否停用',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'isDisabled',
            render: (data) => (
              <el-radio-group vModel={data['isDisabled']}>
                <el-radio label={1}>是</el-radio>
                <el-radio label={0}>否</el-radio>
              </el-radio-group>
            ),
          },
          {
            type: 'empty',
            showBg: true,
          },
          {
            type: 'empty',
            disabled: true,
          },
        ],
        [
          {
            type: 'label',
            label: '线路',
            field: 'xl',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'xl',
            disabled: true,
            render: (data) => <el-input readonly vModel={data['xl']} />,
          },
          {
            type: 'label',
            label: '工程总量',
            field: 'gczl',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'gczl',
            render: (data) => <el-input vModel={data['gczl']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '概算总额（小写）',
            field: 'gszexx',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'gszexx',
            disabled: true,
            render: (data) => <el-input readonly vModel={data['gszexx']} />,
          },
          {
            type: 'label',
            label: '概算总额（大写）',
            field: 'gszedx',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'gszedx',
            disabled: true,
            render: (data) => <el-input readonly vModel={data['gszedx']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '线路长度（公里）',
            field: 'xlcd',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'xlcd',
            render: (data) => <el-input vModel={data['xlcd']} />,
          },
          {
            type: 'label',
            label: '技术经济指标（万元/正线公里）',
            field: 'jsjjzb',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'jsjjzb',
            disabled: true,
            render: (data) => <el-input readonly vModel={data['jsjjzb']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '调整原因',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'adjustReason',
            colspan: '3',
            render: (data) => (
              <el-input type="textarea" vModel={data['adjustReason']} />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '调整说明',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'adjustExplain',
            colspan: '3',
            render: (data) => (
              <el-input type="textarea" vModel={data['adjustExplain']} />
            ),
          },
        ],
      ],
      // 基础信息
      baseInfoList: [
        { title: '单据编号', content: '' },
        { title: '状态', content: '初始状态' },
        { title: '创建时间', content: '2019/7/5  9:10:10' },
        { title: '创建人', content: '项目负责人' },
        { title: '修改人', content: '' },
        { title: '修改时间', content: '' },
      ],
      // 时间线列表（审批信息）
      timelineList: [
        {
          content: '创建单据 由合同部——张三创建',
          timestamp: '2020-04-12 20:46:23',
          type: 'primary',
          icon: 'el-icon-check',
          color: '#0bbd87',
        },
        {
          content: '由审核人李四审通过',
          timestamp: '2020-04-15 20:46:12',
          icon: 'el-icon-check',
          color: '#0bbd87',
        },
        {
          content: '审核人孙晓琳审通中',
          timestamp: '2020-04-16 20:46:12',
          icon: 'el-icon-more',
          color: 'orange',
        },
        {
          content: '待审核人王五审核',
        },
        {
          content: '待审核人马六审核',
        },
      ],
      // 概算列表
      estimateList: [
        {
          key: '1',
          gsbh: '--GS01',
          gsmc: '地下车站',
          gaisuanje: '50580000.74',
          gusuanje: '40000000.74',
          proportion: '79.08%',
        },
        {
          key: '2',
          gsbh: '--GS02',
          gsmc: '高架车站',
          gaisuanje: '50165465.00',
          gusuanje: '49800000.00',
          proportion: '99.27%',
        },
        {
          key: '3',
          gsbh: '--GS03',
          gsmc: '地下区间',
          gaisuanje: '30580000.74',
          gusuanje: '30000000.74',
          proportion: '98.10%',
        },
        {
          key: '4',
          gsbh: '--GS04',
          gsmc: '高架区间',
          gaisuanje: '50000000.00',
          gusuanje: '49800000.00',
          proportion: '99.60%',
        },
      ],
      // 概算列表选中的对象
      selectedEstimate: [],
      // 状态字典
      statusDict: [
        { value: '1', label: '初始状态' },
        { value: '2', label: '审批中' },
        { value: '3', label: '审批完成' },
        { value: '4', label: '已停用' },
      ],
    }
  },
  created() {
    // 假数据
    this.form = {
      bidName: '无锡地铁4号线具区路车辆段基础工程',
      bidCode: Date.now(),
      projectName: '无锡地铁4号线工程',
      zbr: '无锡地铁集团有限公司',
      gsje: '169600001',
      htcsfs: '招标',
      gsjedx: '壹亿陆仟玖佰陆拾万',
      jsdd: '无锡',
      zbfl: '施工类',
      zyfl: '施工-土建',
      zbfs: '1',
      zbzzxs: '1',
      jhkgsj: moment('2020-10-09'),
      jhjgsj: moment('2021-01-05'),
      zbdw: '无锡地铁建设分公司',
      zbbm: '工程部',
      zbry: '项目负责人',
      jhkssj: moment('2020-09-09'),
      bdfw:
        '具区路车辆段主体及附属结构；市政管线迁改；交通疏解；变电所及进出线管廊(若有)等的地铁附属设施施工范围内需迁移的绿化迁移',
      bdnr:
        '主体及附属结构；市政管线迁改；交通疏解；具区路车辆段及配套项目基础工程',
    }
  },
  methods: {
    handleEstimateChange(val) {
      this.selectedEstimate = val
    },
    // 新增概算
    addEstimate() {
      // 需要一个key来进行删除操作
      this.estimateList = [...this.estimateList, { key: Date.now() }]
    },
    // 删除概算列表中选中的数据
    deleteEstimate() {
      if (
        Array.isArray(this.selectedEstimate) &&
        this.selectedEstimate.length
      ) {
        this.estimateList = this.estimateList.filter(
          (item) => !this.selectedEstimate.some((val) => val.key === item.key)
        )
      } else {
        this.$message({
          message: '请先勾选想要删除的数据',
          type: 'warning',
        })
      }
    },
    onSave() {
      this.$refs['gridForm'].$refs['form'].validate((valid, err) => {
        if (err) {
          const msg = Object.entries(err)
          console.log('msg', msg)
        } else {
          console.log('form', this.form)
        }
      })
    },
  },
}
</script>
<style lang="scss">
.container {
  padding: 10px 20px;
  .timeline-container {
    margin-top: 10px;
  }
  .el-input-number .el-input__inner {
    text-align: left;
  }
  .handle-table {
    .el-table td {
      padding: 5px 0;
    }
  }
}
</style>
