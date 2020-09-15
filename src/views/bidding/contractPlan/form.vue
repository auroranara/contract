<template>
  <div class="container">
    <div class="head-container">
      <el-button type="primary">审核</el-button>
      <el-button type="primary">修改</el-button>
      <el-button type="primary" @click="onSave('form')">保存</el-button>
      <el-button type="primary">提交</el-button>
      <el-button type="primary">删除</el-button>
      <el-button type="primary">调整</el-button>
      <el-button type="primary">下推招标计划</el-button>
    </div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="单据信息" name="form">
        <div class="block-title">
          <span>信息</span>
        </div>
        <grid-form ref="gridForm" :rules="rules" :settings="settings" :model="form"></grid-form>
        <div class="block-title">
          <span>概算</span>
        </div>
        <el-button size="small" style="margin-right:10px" type="primary" @click="addEstimate">新增</el-button>
        <el-button size="small" type="danger" @click="deleteEstimate">删除</el-button>
        <div class="handle-table">
          <el-table
            style="margin-top:10px"
            :data="estimateList"
            border
            @selection-change="handleEstimateChange"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="gsbh" label="概算编号" width="200"></el-table-column>
            <el-table-column prop="gsmc" label="概算名称">
              <template slot-scope="scope">
                <el-input size="small" v-model="estimateList[scope.$index].gsmc" />
              </template>
            </el-table-column>
            <el-table-column prop="gaisuanje" label="概算金额" width="250"></el-table-column>
            <el-table-column prop="gusuanje" label="估算金额" width="250">
              <template slot-scope="scope">
                <el-input-number
                  :precision="2"
                  size="small"
                  v-model.number="estimateList[scope.$index].gusuanje"
                  :controls="false"
                />
              </template>
            </el-table-column>
            <el-table-column prop="proportion" label="占比" width="200"></el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="基本信息" name="baseInfo">
        <el-table :data="baseInfoList" style="width: 550px" border>
          <el-table-column prop="title" label="标题" width="180"></el-table-column>
          <el-table-column prop="content" label="内容"></el-table-column>
        </el-table>
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
            >{{activity.content}}</el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import GridForm from '@/components/GridForm'
import moment from 'moment'

export default {
  name: 'Test',
  components: {
    GridForm,
  },
  data() {
    return {
      activeName: 'form',
      form: {},
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
            label: '标段名称',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'bidName',
            tag: 'el-input',
            render: (data) => <el-input vModel={data['bidName']} />,
          },
          {
            type: 'label',
            label: '标段编号',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'bidCode',
            tag: 'el-input',
          },
        ],
        [
          {
            type: 'label',
            label: '项目名称',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'projectName',
            tag: 'el-input',
          },
          {
            type: 'label',
            label: '招标人',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'zbr',
            tag: 'el-input',
          },
        ],
        [
          {
            type: 'label',
            label: '估算金额（元）',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'gsje',
            tag: 'el-input',
          },
          {
            type: 'label',
            label: '合同产生方式',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'htcsfs',
            tag: 'el-input',
          },
        ],
        [
          {
            type: 'label',
            label: '估算金额（大写）',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'gsjedx',
            tag: 'el-input',
          },
          {
            type: 'label',
            label: '建设地点',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'jsdd',
            tag: 'el-input',
          },
        ],
        [
          {
            type: 'label',
            label: '招标分类',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'zbfl',
            tag: 'el-input',
          },
          {
            type: 'label',
            label: '专业分类',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'zyfl',
            tag: 'el-input',
          },
        ],
        [
          {
            type: 'label',
            label: '招标方式',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'zbfs',
            render: (data) => (
              <el-select
                style="width:100%"
                vModel={data['zbfs']}
                placeholder=""
              >
                {this.tenderMethods.map(({ value, label }) => (
                  <el-option value={value} label={label} key={value} />
                ))}
              </el-select>
            ),
          },
          {
            type: 'label',
            label: '招标组织形式',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'zbzzxs',
            render: (data) => (
              <el-select
                style="width:100%"
                vModel={data['zbzzxs']}
                placeholder=""
              >
                {this.tenderOrganizationForms.map(({ value, label }) => (
                  <el-option value={value} label={label} key={value} />
                ))}
              </el-select>
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '计划开工时间',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'jhkgsj',
            render: (data) => (
              <el-date-picker
                vModel={data['jhkgsj']}
                type="datetime"
                style="width:100%"
              ></el-date-picker>
            ),
          },
          {
            type: 'label',
            label: '计划竣工时间',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'jhjgsj',
            render: (data) => (
              <el-date-picker
                vModel={data['jhjgsj']}
                type="datetime"
                style="width:100%"
              ></el-date-picker>
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '主办单位',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'zbdw',
            tag: 'el-input',
          },
          {
            type: 'label',
            label: '主办部门',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'zbbm',
            tag: 'el-input',
          },
        ],
        [
          {
            type: 'label',
            label: '主办人员',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'zbry',
            tag: 'el-input',
          },
          {
            type: 'label',
            label: '计划开始时间',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'jskssj',
            render: (data) => (
              <el-date-picker
                vModel={data['jskssj']}
                type="datetime"
                style="width:100%"
              ></el-date-picker>
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '标段范围',
            required: true,
            showBg: true,
          },
          {
            type: 'handler',
            field: 'bdfw',
            colspan: '3',
            render: (data) => (
              <el-input
                type="textarea"
                vModel={data['bdfw']}
                rows="4"
              ></el-input>
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '标段内容',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'bdnr',
            colspan: '3',
            render: (data) => (
              <el-input
                type="textarea"
                vModel={data['bdnr']}
                rows="3"
              ></el-input>
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '备注',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'bz',
            colspan: '3',
            render: (data) => (
              <el-input type="textarea" vModel={data['bz']} rows="2"></el-input>
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
      this.$refs['gridForm'].$refs['form'].validate((valid, obj) => {
        const msg = Object.entries(obj)
        console.log('msg', msg)
        if (valid) {
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
  .block-title {
    border-bottom: 2px solid #1890ff;
    padding-left: 10px;
    padding-bottom: 5px;
    margin-bottom: 10px;
    & > span {
      display: inline-block;
      padding-left: 8px;
      height: 26px;
      line-height: 26px;
      border-left: 4px solid #1890ff;
      font-size: 18px;
    }
  }
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
