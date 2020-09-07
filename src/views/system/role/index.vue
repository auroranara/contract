<template>
  <div class="app-container calendar-list-container">
    <el-row :gutter="20" style="margin-top:50px;">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>角色</span>
            <el-button
              v-permission="['roles:add']"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-plus"
              @click="addRole"
            >新增</el-button>
            <el-button
              v-permission="['roles:edit']"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-edit"
              @click="editRole"
            >编辑</el-button>
          </div>
          <div style="height:500px;">
            <el-tree
              ref="roleTree"
              :data="roleList"
              :accordion="true"
              :props="defaultRoleProps"
              node-key="key"
              show-checkbox
              check-on-click-node
              @check-change="handleRoleNodeChange"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>资源</span>
            <el-button
              v-permission="['roles:add']"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-success"
              @click="addRoleResource"
            >保存</el-button>
          </div>
          <div class="component-item">
            <el-tree
              ref="resourceTree"
              :data="menus"
              :props="defaultResourceProps"
              node-key="id"
              show-checkbox
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog append-to-body :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="temp.code" :disabled="dialogStatus=='update'" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="temp.status"
            value-key="item.value"
            class="filter-item"
            placeholder="请选择状态"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :value="item.value"
              :label="item.text"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAll, getResourceIdsByRoleId, saveRoleResource, add, edit } from '@/api/system/role'
import { queryResources } from '@/api/system/resource'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'Role',
  data() {
    return {
      defaultRoleProps: {
        children: 'children',
        label: 'title',
        roleCode: '',
        status: ''
      },
      temp: {
        id: undefined,
        name: '',
        code: '',
        status: ''
      },
      dialogStatus: '',
      defaultResourceProps: {
        children: 'children',
        label: 'label'
      },
      dialogFormVisible: false,

      rules: {
        name: [{ required: true, message: '请填写角色名称', trigger: 'blur' }],
        code: [{ required: true, message: '请填写角色编码', trigger: 'blur' }]
      },
      statusOptions: [
        { text: '启用', value: '0' },
        { text: '禁用', value: '1' }
      ],
      textMap: {
        update: '编辑',
        create: '创建'
      },
      currentId: 0, menuLoading: false, showButton: false,
      menus: [], menuIds: [], depts: [],
      roleList: [],
      permission: {
        // add: ['admin', 'roles:add'],
        // edit: ['admin', 'roles:edit'],
        // del: ['admin', 'roles:del']
      }
    }
  },
  created() {
    this.getMenus()
    this.getRoleList()
    // this.$nextTick(() => {
    //   this.crud.toQuery()
    // })
  },
  methods: {
    getMenus() {
      queryResources().then(res => {
        this.menus = res.data
      })
    },
    getRoleList() {
      getAll().then(res => {
        this.roleList = res.data
      })
    },
    addRole() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.dialogFormVisible = true
      })
    },
    updateData() {
      // 更新角色
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          edit(this.temp).then(
            () => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.getRoleList()
            }
          )
        }
      })
    },
    createData() {
      // 创建角色
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          add(this.temp).then(
            () => {
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.getRoleList()
            }
          )
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        code: '',
        status: '0'
      }
    },
    editRole() {
      // 弹出角色编辑框
      const checkedNodes = this.$refs.roleTree.getCheckedNodes()
      if (checkedNodes.length === 0) {
        this.$message.error('请选择角色')
        return
      }
      this.temp.id = checkedNodes[0].key
      this.temp.name = checkedNodes[0].title
      this.temp.code = checkedNodes[0].roleCode
      this.temp.status = checkedNodes[0].status + ''
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleRoleNodeChange(data, checked, indeterminat) {
      if (checked) {
        getResourceIdsByRoleId(data.key).then(res => {
          if (res.data != null) {
            const checkedNodes = res.data.split(',')
            var resultCheckNodes = []

            checkedNodes.forEach(node => {
              resultCheckNodes.push(node)
            })
            this.$refs.resourceTree.setCheckedKeys(resultCheckNodes)
          }
        })
        this.$refs.roleTree.setCheckedNodes([data])
      } else {
        this.$refs.resourceTree.setCheckedNodes([])
      }
    },
    addRoleResource() {
      // 保存角色和资源的关系
      const roleKeys = this.$refs.roleTree.getCheckedKeys()
      if (roleKeys.length !== 1) {
        this.$message.error('请选择一个角色')
        return
      }
      let resourceKeys = this.$refs.resourceTree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.resourceTree.getHalfCheckedKeys()
      resourceKeys = resourceKeys.concat(halfCheckedKeys)
      var data = {
        roleId: roleKeys[0],
        resources: resourceKeys
      }
      saveRoleResource(data).then(() => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
