<template>
  <div class="container">
    <div class="head-container">
      <el-button plain type="primary">审批</el-button>
      <el-button plain type="primary" @click="onSave('form')">保存</el-button>
      <el-button plain type="primary">提交</el-button>
      <el-button plain type="primary">删除</el-button>
      <el-button plain type="primary">调整</el-button>
      <el-button plain type="primary">任务派发</el-button>
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
  name: 'biddingPlanStartForm',
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
      settings: [
        [
          {
            type: 'label',
            label: '单据名称',
            field: 'djmc',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'djmc',
            render: (data) => <el-input vModel={data['djmc']} />,
          },
          {
            type: 'label',
            label: '年度',
            field: 'nd',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'nd',
            render: (data) => <el-input vModel={data['nd']} />,
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
            label: '编制开始时间',
            field: 'bzkssj',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'bzkssj',
            render: (data) => (
              <el-date-picker
                vModel={data['bzkssj']}
                type="datetime"
                placeholder=""
              ></el-date-picker>
            ),
          },
          {
            type: 'label',
            label: '编制截止时间',
            field: 'bzjzsj',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'bzjzsj',
            render: (data) => (
              <el-date-picker
                vModel={data['bzjzsj']}
                type="datetime"
                placeholder=""
              ></el-date-picker>
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '编制要求',
            field: 'bzyq',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'bzyq',
            colspan: '3',
            render: (data) => (
              <el-input type="textarea" vModel={data['bzyq']} />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '备注',
            field: 'bz',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'bz',
            colspan: '3',
            render: (data) => <el-input type="textarea" vModel={data['bz']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '计划导入模板',
            field: 'jhdrmb',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'jhdrmb',
            colspan: '3',
            render: (data) => (
              <div>
                <a>年度招标计划导入模板.xlsx</a>
              </div>
            ),
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
    }
  },
  created() {
    // 假数据
    this.form = {}
  },
  methods: {
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
