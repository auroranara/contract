<template>
  <div>
    <div v-if="form.dictId === null">
      <div class="my-code">点击字典查看详情</div>
    </div>
    <div v-else>
      <!--工具栏-->
      <div class="head-container">
        <el-button v-permission="['dicts:add']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="addForm">新增</el-button>
      </div>
      <!--表单组件-->
      <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="visableDialog" :title="form.id?'编辑':'新增'" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="字典标签" prop="label">
            <el-input v-model="form.label" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="字典值" prop="value">
            <el-input v-model="form.value" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="visableDialog=false">取消</el-button>
          <el-button type="primary" @click="save">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table v-loading="loading" :data="dictDetaildata" style="width: 100%;">
        <el-table-column label="所属字典">
          {{ dictName }}
        </el-table-column>
        <el-table-column prop="label" label="字典标签" />
        <el-table-column prop="value" label="字典值" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column label="操作" width="130px" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
            <el-popover
              :ref="scope.row.id"
              placement="top"
              width="180"
            >
              <p>确定删除本条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getDictDetails, add, edit, del } from '@/api/system/dictDetail'
export default {
  data() {
    return {
      loading: false,
      title: '字典详情',
      dictName: '',
      dictDetaildata: [],
      visableDialog: false,
      form: { dictId: null, label: null, value: null, sort: null, id: null },
      rules: {
        label: [
          { required: true, message: '请输入字典标签', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ]
      }
    }
  },
  methods: {
    initDictDetails() {
      this.loading = true
      getDictDetails(this.form.dictId).then((res) => {
        this.dictDetaildata = res.data
        this.loading = false
      })
    },
    showEditFormDialog(row) {
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      this.form.label = row.label
      this.form.value = row.value
      this.form.sort = row.sort
      this.form.id = row.id
      this.visableDialog = true
    },
    delMethod(id) {
      del(id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.$refs[id].doClose()
        this.initDictDetails()
        this.visableDialog = false
      })
    },
    addForm() {
      this.form.label = null
      this.form.value = null
      this.form.sort = null
      this.form.id = null
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      this.visableDialog = true
    },
    save() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id === null) {
            add(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
              this.initDictDetails()
              this.visableDialog = false
            })
          } else {
            edit(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.initDictDetails()
              this.visableDialog = false
            })
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
