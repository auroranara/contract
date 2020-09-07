<template>
  <div class="app-container">
    <!--表单组件-->
    <el-dialog :title="form.id?'编辑':'新增'" append-to-body :close-on-click-modal="false" :visible.sync="dialogVisible" width="500px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="form.name" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" style="width: 370px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="saveDict">确认</el-button>
      </div>
    </el-dialog>
    <!-- 字典列表 -->
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典列表</span>
          </div>
          <!--工具栏-->
          <div class="head-container">
            <!-- 搜索 -->
            <el-input v-model="listQuery.name" clearable size="small" placeholder="输入名称" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" />
            <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
            <el-button v-permission="['dicts:add']" class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="showAddFormDialog">新增</el-button>
          </div>
          <!--表格渲染-->
          <el-table v-loading="loading" :data="dictData" highlight-current-row style="width: 100%;" @current-change="handleCurrentChange">
            <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" />
            <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述" />
            <el-table-column label="操作" width="130px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button v-permission="['dicts:edit']" size="mini" type="primary" icon="el-icon-edit" @click="showEditFormDialog(scope.row)" />
                <el-popover
                  :ref="scope.row.id"
                  placement="top"
                  width="180"
                >
                  <p>此操作将删除字典与对应的字典详情，确定要删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="false" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" v-permission="['dicts:del']" type="danger" icon="el-icon-delete" size="mini" />
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initDicts" />
        </el-card>
      </el-col>
      <!-- 字典详情列表 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>字典详情</span>
          </div>
          <dictDetail ref="dictDetail" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDicts, addDict, delDict, editDict } from '@/api/system/dict'
import dictDetail from './dictDetail'
import Pagination from '@/components/Pagination'
export default {
  name: 'Dict',
  components: { dictDetail, Pagination },
  data() {
    return {
      total: 0,
      loading: true,
      listQuery: {
        name: '',
        page: 1,
        limit: 10
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请填写描述', trigger: 'blur' }]
      },
      dialogVisible: false,
      dictData: [],
      queryTypeOptions: [
        { key: 'name', display_name: '字典名称' },
        { key: 'remark', display_name: '描述' }
      ],
      form: { id: null, name: null, remark: null }
    }
  },
  created() {
    this.initDicts()
  },
  methods: {
    toQuery() {
      this.listQuery.page = 1
      this.initDicts()
    },
    initDicts() {
      getDicts(this.listQuery).then((res) => {
        this.dictData = res.data
        this.total = res.total
        this.loading = false
      })
    },
    delMethod(id) {
      delDict(id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.$refs.dictDetail.form.dictId = null
        this.$refs[id].doClose()
        this.initDicts()
        this.dialogVisible = false
      })
    },
    showAddFormDialog() {
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      this.form = { id: null, name: null, remark: null }
      this.dialogVisible = true
    },
    showEditFormDialog(row) {
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
      this.form = { id: row.id, name: row.name, remark: row.remark }
      this.dialogVisible = true
    },
    saveDict() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id === null) {
            addDict(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success',
                duration: 2000
              })
              this.initDicts()
              this.dialogVisible = false
            })
          } else {
            editDict(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.initDicts()
              this.dialogVisible = false
            })
          }
        }
      })
    },
    // 选中字典后，设置字典详情数据
    handleCurrentChange(val) {
      if (val) {
        this.$refs.dictDetail.dictName = val.name
        this.$refs.dictDetail.form.dictId = val.id
        this.$refs.dictDetail.initDictDetails()
      }
    }
  }
}
</script>

<style scoped>
</style>
