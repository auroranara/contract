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
      <el-tab-pane label="合同策划单" name="form">
        <el-form ref="form" :model="form" :rules="rules" :hide-required-asterisk="true">
          <div class="table-border">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                <td>
                  <div class="label is-required">标段名称：</div>
                </td>
                <td>
                  <div class="cell">
                    <el-form-item prop="bidName">
                      <el-input v-model="form.bidName" />
                    </el-form-item>
                  </div>
                </td>
                <td>
                  <div class="label">标段编号：</div>
                </td>
                <td>
                  <div class="cell">
                    <el-form-item prop="bidCode">
                      <el-input v-model="form.bidCode" />
                    </el-form-item>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="label is-required">项目名称：</div>
                </td>
                <td>
                  <div class="cell">
                    <el-form-item>
                      <el-input />
                    </el-form-item>
                  </div>
                </td>
                <td>
                  <div class="label is-required">招标人：</div>
                </td>
                <td>
                  <div class="cell">
                    <el-form-item>
                      <el-input />
                    </el-form-item>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="label is-required">估算金额（元）：</div>
                </td>
                <td>
                  <div class="cell">
                    <el-form-item>
                      <el-input />
                    </el-form-item>
                  </div>
                </td>
                <td>
                  <div class="label is-required">合同产生方式：</div>
                </td>
                <td>
                  <div class="cell">
                    <el-form-item>
                      <el-input />
                    </el-form-item>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="label is-required">估算金额（大写）：</div>
                </td>
                <td>
                  <div class="cell">
                    <el-form-item>
                      <el-input type="textarea" :rows="2" />
                    </el-form-item>
                  </div>
                </td>
                <td>
                  <div class="label is-required">建设地点：</div>
                </td>
                <td>
                  <div class="cell">
                    <el-form-item>
                      <el-input />
                    </el-form-item>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="label is-required">标段范围：</div>
                </td>
                <td colspan="3">
                  <div class="cell">
                    <el-form-item>
                      <el-input type="textarea" :rows="3" />
                    </el-form-item>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="label">标段内容：</div>
                </td>
                <td colspan="3">
                  <div class="cell">
                    <el-form-item>
                      <el-input type="textarea" :rows="2" />
                    </el-form-item>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="label">备注：</div>
                </td>
                <td colspan="3">
                  <div class="cell">
                    <el-form-item>
                      <el-input type="textarea" :rows="1" />
                    </el-form-item>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="概算" name="desc">
        <keep-alive>概算</keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'Test',
  data() {
    return {
      activeName: 'form',
      form: {
        bidName: '',
        bidCode: '',
      },
      rules: {
        bidName: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        bidCode: [{ required: true, message: '请上传图片', trigger: 'blur' }],
      },
    }
  },
  methods: {
    onSave(refName) {
      this.$refs[refName].validate((valid, obj) => {
        console.log('obj', obj)
        if (valid) {
          console.log('form', this.form)
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
// $border: #a8a8a9;
$border: #d3d3d3;
.container {
  padding: 10px 20px;
}
.btn_container {
  margin-bottom: 10px;
}
.table-border {
  margin-bottom: 20px;
  border: 1px solid $border;
  border-right: none;
  border-bottom: none;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  background-color: #fff;
  font-size: 14px;
  color: #606266;
}
tr {
  td:nth-child(2n-1) {
    width: 15%;
    color: #909399;
    font-weight: bold;
    .is-required:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  td:nth-child(2n) {
    width: 35%;
  }
}
td {
  border-bottom: 1px solid $border;
  border-right: 1px solid $border;
  padding: 5px 0;
  min-width: 0;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
.label {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-left: 10px;
  padding-right: 10px;
}
.cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 23px;
  padding-left: 10px;
  padding-right: 10px;
}
::v-deep .el-form-item {
  margin-bottom: 0;
}
</style>
