<template>
  <div class="container">
    <div class="btn_container">
      <el-button type="primary">审核</el-button>
      <el-button type="primary">修改</el-button>
      <el-button type="primary" @click="onSave('form')">保存</el-button>
      <el-button type="primary">提交</el-button>
      <el-button type="primary">删除</el-button>
      <el-button type="primary">调整</el-button>
      <el-button type="primary">下推招标计划</el-button>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="单据信息" name="form">
        <grid-form ref="gridForm" :rules="rules" :settings="settings" :model="form"></grid-form>
      </el-tab-pane>
      <el-tab-pane label="基本信息" name="baseInfo">
        <keep-alive>基本信息</keep-alive>
      </el-tab-pane>
      <el-tab-pane label="审批信息" name="approval">
        <keep-alive>审批信息</keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import GridForm from '@/components/GridForm'

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
            field: 'htscfs',
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
            type: 'empty',
            showBg: true,
          },
          {
            type: 'empty',
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
            field: 'zbbm',
            render: (data) => (
              <el-date-picker
                vModel={data['zbbm']}
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
    }
  },
  methods: {
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
<style lang="scss" scoped>
.container {
  padding: 10px 20px;
}
.btn_container {
  margin-bottom: 10px;
}
</style>
