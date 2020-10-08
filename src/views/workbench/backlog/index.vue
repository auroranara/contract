<template>
  <div class="app-container">
    <div class="head-container">
      <expand-Filter :fields="fields" :model="listQuery" type="inline">
        <template v-slot:operations>
          <el-button type="primary" icon="el-icon-search" @click="onSearch"
            >筛选</el-button
          >
          <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
        </template>
      </expand-Filter>
    </div>
    <el-card>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" width="80">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column
          align="center"
          label="工作阶段"
          prop="workStage"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="待办任务"
          prop="toDoTask"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="单据类型"
          prop="ticketType"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="单据名称"
          prop="ticketName"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <el-link
              @click="handleView(scope.row)"
              type="primary"
              :underline="false"
              >{{ scope.row.ticketName }}</el-link
            >
          </template>
        </el-table-column>
        <!-- <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
          :show-overflow-tooltip="true"
        ></el-table-column> -->
        <el-table-column
          align="center"
          label="备注"
          prop="remarks"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button @click="handleView(scope.row)" type="text"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>
<script>
import ExpandFilter from '@/components/ExpandFilter'
import Pagination from '@/components/Pagination'
import moment from 'moment'
import { fetchTaskFlowList } from '@/api/workbench'
import jump from '@/utils/jump'

export default {
  name: 'backlog',
  components: {
    ExpandFilter,
    Pagination,
  },
  data() {
    return {
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        dealType: 1,
      },
      total: 0,
      list: [],
      fields: [
        {
          field: 'toDoTask',
          alwaysShow: true,
          label: '待办任务',
          render: (data) => (
            <el-input placeholder="待办任务" vModel={data['toDoTask']} />
          ),
        },
        {
          field: 'ticketName',
          label: '单据名称',
          alwaysShow: true,
          render: (data) => (
            <el-input placeholder="单据名称" vModel={data['ticketName']} />
          ),
        },
        {
          field: 'workStage',
          label: '工作阶段',
          render: (data) => (
            <el-input placeholder="工作阶段" vModel={data['workStage']} />
          ),
        },
        {
          field: 'ticketType',
          label: '单据类型',
          render: (data) => (
            <el-input placeholder="单据类型" vModel={data['ticketType']} />
          ),
        },
        {
          field: 'createTime',
          label: '创建时间',
          render: (data) => (
            <el-date-picker
              style="width:100%"
              vModel={data['createTime']}
              type="daterange"
              unlink-panels
              range-separator="-"
              picker-options={this.pickerOptions}
              default-time={['00:00:00', '23:59:59']}
            ></el-date-picker>
          ),
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const start = moment().startOf('week')
              const end = moment().endOf('day')
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const start = moment().startOf('month')
              const end = moment().endOf('day')
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await fetchTaskFlowList(this.listQuery)
      this.list = res.data || []
      this.total = res.total || 0
      this.listLoading = false
    },
    // 点击新增
    onSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    // 点击筛选重置
    onReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
      }
      this.getList()
    },
    // 点击查看
    handleView(data) {
      jump(data)
    },
  },
}
</script>
