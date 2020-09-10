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
        <grid-form
          ref="gridForm"
          :rules="rules"
          :settings="settings"
          :form="form"
        ></grid-form>
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
import gridForm from '@/views/components/gridForm'

export default {
  name: 'Test',
  components: {
    gridForm
  },
  data() {
    return {
      activeName: 'form',
      form: {},
      rules: {
        bidName: [
          { required: true, message: '请输入标段名称', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '请选择项目名称', trigger: 'blur' }
        ],
        jsx: [{ required: true, message: '请评分实时性', trigger: 'blur' }]
      },
      projects: [
        { value: '1', label: '无锡地铁1号线工程' },
        { value: '2', label: '无锡地铁2号线工程' }
      ],
      settings: [
        [
          {
            type: 'label',
            label: '标段名称',
            required: true
          },
          {
            type: 'handler',
            field: 'bidName',
            tag: 'el-input',
            render: data => <el-input vModel={data['bidName']} />
          },
          {
            type: 'label',
            label: '标段编号'
          },
          {
            type: 'handler',
            field: 'bidCode',
            tag: 'el-input'
          }
        ],
        [
          {
            type: 'label',
            label: '项目名称名称',
            required: true
          },
          {
            type: 'handler',
            field: 'projectName',
            tag: 'el-input',
            render: data => (
              <el-select
                vModel={data['projectName']}
                style="width:100%"
                clearable
              >
                {this.projects.map(({ value, label }) => (
                  <el-option value={value} label={label} key={value} />
                ))}
              </el-select>
            )
          },
          {
            type: 'label',
            label: '招标人',
            required: true
          },
          {
            type: 'handler',
            field: 'zbr',
            tag: 'el-input'
          }
        ],
        [
          {
            type: 'label',
            label: '估算金额（元）',
            required: true
          },
          {
            type: 'handler',
            field: 'gsje',
            tag: 'el-input'
          },
          {
            type: 'label',
            label: '合同产生方式'
          },
          {
            type: 'handler',
            field: 'htscfs',
            tag: 'el-input'
          }
        ],
        [
          {
            type: 'label',
            label: '估算金额（大写）',
            required: true
          },
          {
            type: 'handler',
            field: 'gsjedx',
            tag: 'el-input'
          },
          {
            type: 'label',
            label: '建设地点'
          },
          {
            type: 'handler',
            field: 'jsdd',
            tag: 'el-input'
          }
        ],
        [
          {
            type: 'label',
            label: '招标分类',
            required: true
          },
          {
            type: 'handler',
            field: 'zbfl',
            tag: 'el-input'
          },
          {
            type: 'label',
            label: '专业分类'
          },
          {
            type: 'handler',
            field: 'zyfl',
            tag: 'el-input'
          }
        ]
      ]
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
    }
  }
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
