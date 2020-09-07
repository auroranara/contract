<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.psnId" placeholder="用户名" style="width: 200px;" class="filter-item" clearable />
      <el-input v-model="listQuery.mobile" placeholder="手机号" style="width: 200px;" class="filter-item" clearable />
      <el-select v-model="listQuery.type" placeholder="类型" clearable>
        <el-option label="系统" :value="0" />
        <el-option label="内部" :value="1" />
        <el-option label="外部" :value="2" />
      </el-select>
      <el-select v-model="listQuery.lineId" @change="lineChange" class="filter-item"  placeholder="线路名称"  clearable >
        <el-option v-for="item in subject" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-if="listQuery.lineId && subject && subject.length" v-model="listQuery.stationId"  class="filter-item"  placeholder="站点名称" clearable>
        <el-option v-for="item in subject.find(_=>_.id == listQuery.lineId).children" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchUser">搜索</el-button>
      <el-button v-permission="['users:add']" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="addUser">新增</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;margin-top:30px;">
      <el-table-column align="center" label="ID" width="80" type="index">
        <template slot-scope="scope">
          <span>{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.psnId }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="真实姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.psnName }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type|typeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.dr| drFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-permission="['users:edit']" type="primary" size="small" icon="el-icon-edit" @click="editUser(scope.row)">编辑</el-button>
          <el-button v-permission="['users:edit']" type="primary" size="small" icon="el-icon-edit" @click="showSortList(scope.row.psnId)">关联责任主体</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog append-to-body :visible.sync="dialogSubject" width="760px" title="责任主体" class="userDialog">
      <div class="component-item" style="height:350px;overflow: auto;">
        <el-button v-if="!showAll" class="filter-item" type="success" icon="el-icon-arrow-down" @click="changeShow">展开</el-button>
        <el-button v-if="showAll" class="filter-item" type="success" icon="el-icon-arrow-up" @click="changeShow">收起</el-button>
        <el-tree
          ref="sortTree"
          :data="sortList"
          :props="defaultSortProps"
          :check-strictly="true"
          :default-checked-keys="checkIdList"
          node-key="id"
          show-checkbox
        ><span slot-scope="{ node,data }" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span v-show="node.checked">
            <el-select
              v-model="data.read"
              class="selectInput"
              style="width: 100px"
            >
              <el-option label=" " :value="-1" />
              <el-option label="任务只读" :value="0" />
              <el-option label="任务填报" :value="1" />
            </el-select>
            <el-select
              v-model="data.problemRead"
              style="width: 120px"
            >
              <el-option label=" " :value="-1" />
              <el-option label="问题只读" :value="0" />
              <el-option label="问题处理" :value="1" />
              <el-option label="问题结束" :value="2" />
              <el-option label="处理&结束" :value="3" />
            </el-select>
          </span>
        </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="cancel" @click="cancel">取消</el-button>
        <el-button v-loading="listLoading" type="primary" @click="saveSort">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog append-to-body :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item v-if="temp.type!==1" label="用户名" prop="psnId">
          <el-input v-model="temp.psnId" :disabled="dialogStatus=='update'" placeholder="请输入用户名" maxlength="33" />
        </el-form-item>
        <el-form-item v-if="temp.type!==1" label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item v-if="temp.type!==1" label="真实姓名" placeholder="请输入真实姓名" prop="psnName">
          <el-input v-model="temp.psnName" />
        </el-form-item>
        <el-form-item v-if="temp.type!==1" label="手机号码" prop="mobile" placeholder="请输入手机号码">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item v-if="temp.type!==1" label="身份证号码" prop="cardNo" placeholder="请输入身份证号码">
          <el-input v-model="temp.cardNo" />
        </el-form-item>
        <el-form-item v-if="temp.type!==1" label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择类型">
            <el-option label="系统" :value="0" />
            <el-option label="外部" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="temp.roles" multiple placeholder="请选择角色">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.type!==1" label="状态" prop="dr">
          <el-select v-model="temp.dr" value-key="item.value" class="filter-item" placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.value" :value="item.value" :label="item.text" />
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
import { userList, saveUser, updateUser, updateSubject } from '@/api/system/user'
import { roleManage } from '@/api/system/role'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { isvalidPhone, validEmpty,validateIdNo } from '@/utils/validate'
import { getAuthSubject } from '@/api/manage/subject'
import { getEnableLine } from '@/api/manage/subject'
import { getDictRedis } from '@/api/system/dictDetail'

export default {
  dicts: ['PROBLEM'],
  name: 'UserList',
  components: { Pagination },
  filters: {
    drFilter(status) {
      if (status === 0) {
        return '启用'
      }
      return '禁用'
    },
    typeFilter(type) {
      if (type === 0) {
        return '系统'
      } else if (type === 1) {
        return '内部'
      }
      return '外部'
    }
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!validEmpty(value) && value.length != 11) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    const validateRole = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请选择角色'))
      } else {
        callback()
      }
    }
    const validateCardNo = (rule, value, callback) => {
      if (!validEmpty(value)) {
        validateIdNo(rule, value, callback)
      } else {
        callback()
      }
    }
    return {
      list: null,
      psnId: null,
      total: 0,
      listLoading: true,
      dialogSubject: false,
      listQuery: {
        psnId: '',
        type: null,
        page: 1,
        limit: 20,
        lineId: null,
        stationId: null
      },
      defaultRegionProps: {
        children: 'children',
        label: 'label',
        level: 0,
        parentId: 0
      },
      rules: {
        psnId: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请填写密码', trigger: 'blur' }, { min: 6, message: '长度至少6个字符', trigger: 'blur' }],
        mobile: [{ trigger: 'blur', validator: validateMobile }],
        dr: [{ required: true, message: '请选择状态', trigger: 'change' }],
        cardNo: [{ trigger: 'blur', validator: validateCardNo }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        roles: [{ required: true, trigger: 'change', validator: validateRole }],
        psnName: [{ required: true, message: '请填写真实姓名', trigger: 'blur' }]
      },
      sortList: [],
      checkIdList: [],
      defaultSortProps: {
        children: 'children',
        label: 'name'
      },
      subject: [],
      statusOptions: [{ text: '启用', value: '0' }, { text: '禁用', value: '1' }],
      temp: {
        userId: undefined,
        psnId: '',
        password: '',
        psnName: '',
        mobile: '',
        cardNo: '',
        dr: '',
        roles: [],
        type: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      roleOptions: [],
      showAll: false
    }
  },
  created() {
    console.log(this.dict.PROBLEM)
    this.getList()
    this.loadRole()
  },
  mounted(){
    this.getSubject()
  },
  methods: {
    getList() {
      this.listLoading = true
      userList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    lineChange(){
      this.listQuery.stationId = null
    },

    getSubject(){
      getEnableLine().then((res)=>{
        this.subject = res.data
      })
    },
    saveSort() {
      this.dialogSubject = true
      const selectList = this.$refs.sortTree.getCheckedNodes()
      const param = {
        psnId: this.psnId,
        subjectList: selectList
      }
      updateSubject(param).then(res => {
        this.dialogSubject = false
        this.listLoading = false
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    showSortList(psnId) {
      this.getSortList(psnId)
    },
    cancel() {
      this.dialogSubject = false
    },
    getSortList(psnId) {
      this.psnId = psnId
      this.listLoading = true
      this.showAll = false
      this.sortList = []
      getAuthSubject(psnId).then(res => {
        this.sortList = res.data.treeData
        this.checkIdList = res.data.checkIds
        this.dialogSubject = true
        this.listLoading = false
      })
    },
    loadRole() {
      roleManage().then((response) => {
        for (var i = 0; i < response.data.length; i++) {
          if (response.data[i].status === 0) {
            const json = { text: response.data[i].title, value: response.data[i].key }
            this.roleOptions.push(json)
          }
        }
      })
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    searchUser() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        userId: undefined,
        psnId: '',
        password: '',
        psnName: '',
        mobile: '',
        cardNo: '',
        dr: '0',
        roles: [],
        type: 0
      }
    },
    addUser() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    changeShow() {
      this.showAll = !this.showAll
      if (this.sortList.length > 0) {
        for (var i = 0; i < this.$refs.sortTree.store._getAllNodes().length; i++) {
          this.$refs.sortTree.store._getAllNodes()[i].expanded = this.showAll
        }
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    editUser(row) {
      this.temp = {
        userId: row.userId,
        psnId: row.psnId,
        password: '丨丨丨丨丨丨',
        psnName: row.psnName,
        mobile: row.mobile,
        cardNo: row.cardNo || '',
        dr: row.dr + '',
        roles: row.roles || [],
        type: row.type
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.password === '丨丨丨丨丨丨') {
            this.temp.password = ''
          }
          updateUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch((res) => {
            console.log(this.temp)
            this.temp.password = '丨丨丨丨丨丨'
          })
        }
      })
    }
  }
}
</script>

<style>
  .userDialog .el-input__inner{
    border: none !important;
    background-color: inherit;
  }
  .userDialog .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

</style>
