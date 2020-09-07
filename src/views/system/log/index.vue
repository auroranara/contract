<template>
  <div class="app-container">
    <div class="head-container">
      <div>
        <el-input
          v-model="listQuery.userName"
          clearable
          size="small"
          placeholder="姓名"
          style="width: 200px;"
          class="filter-item"
        />
        <el-input
          v-model="listQuery.desc"
          clearable
          size="small"
          placeholder="描述"
          style="width: 200px;"
          class="filter-item"
        />
        <el-date-picker
          v-model="listQuery.createTime"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <span>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" @click="reSet">重置</el-button>
        </span>
      </div>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="listLoading"
      :data="list"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="请求方法">
              <span>{{ scope.row.method }}</span>
            </el-form-item>
            <el-form-item label="请求参数">
              <span>{{ scope.row.params }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="time" label="请求耗时" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.consumeTime <= 300">{{ scope.row.consumeTime }}ms</el-tag>
          <el-tag v-else-if="scope.row.consumeTime <= 1000" type="warning">{{ scope.row.consumeTime }}ms</el-tag>
          <el-tag v-else type="danger">{{ scope.row.consumeTime }}ms</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="180px">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getSystemLogs } from '@/api/system/log'
import Pagination from '@/components/Pagination'
export default {
  name: 'Log',
  components: { Pagination },
  data() {
    return {
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        userName: null,
        desc: null,
        createTime: null,
        endDate: null,
        startDate: null
      },
      list: [],
      total: null

    }
  },
  created() {
    this.getList()
  },
  methods: {
    confirmDelAll() {
      this.$confirm(`确认清空所有操作日志吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.crud.delAllLoading = true
        // delAllInfo().then(res => {
        //   this.crud.delAllLoading = false
        //   this.crud.dleChangePage(1)
        //   this.crud.delSuccessNotify()
        //   this.crud.toQuery()
        // }).catch(err => {
        //   this.crud.delAllLoading = false
        //   console.log(err.response.data.message)
        // })
      }).catch(() => {
      })
    },
    getList() {
      this.listLoading = true
      if (this.listQuery.createTime !== null) {
        this.listQuery.startDate = this.listQuery.createTime[0]
        this.listQuery.endDate = this.listQuery.createTime[1]
      } else {
        this.listQuery.startDate = null
        this.listQuery.endDate = null
      }
      getSystemLogs(this.listQuery).then(res => {
        this.list = res.data
        this.total = res.total
        this.listLoading = false
      })
    },
    search() {
      this.listQuery.page = 1
      this.getList()
    },
    reSet() {
      this.listQuery.createTime = null
      this.listQuery.page = 1
      this.listQuery.limit = 10
      this.listQuery.userName = null
      this.listQuery.desc = null
      this.getList()
    }
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 70px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand .el-form-item__content {
  font-size: 12px;
}
</style>
