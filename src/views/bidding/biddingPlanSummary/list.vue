<template>
  <div class="app-container">
    <div class="head-container">
      <el-card>
        <expand-Filter :fields="fields" :model="listQuery">
          <template v-slot:operations>
            <el-button type="primary" icon="el-icon-search" @click="onSearch"
              >查询</el-button
            >
            <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
            <el-button type="primary" @click="onClickAdd">新增</el-button>
          </template>
        </expand-Filter>
      </el-card>
    </div>
    <el-card>
      <!--表格渲染-->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column align="center" label="序号" width="80" type="index">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="单据名称"
          prop="djmc"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="年度"
          prop="nd"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="编制部门"
          prop="bzbm"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="批复金额（万元）"
          prop="bzbm"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="编制开始时间"
          prop="bzkssj"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="编制截止时间"
          prop="bzjzsj"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="编制要求"
          prop="bzyq"
          :show-overflow-tooltip="true"
        ></el-table-column>

        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.row)">
              查看
            </el-button>
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
import Pagination from '@/components/Pagination'
import ExpandFilter from '@/components/ExpandFilter'

export default {
  name: 'biddingPlanSummaryList',
  components: {
    Pagination,
    ExpandFilter,
  },
  data() {
    return {
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0,
      list: [],
      fields: [
        {
          field: 'djmc',
          alwaysShow: true,
          label: '单据名称',
          render: (data) => (
            <el-input placeholder="单据名称" vModel={data['djmc']} />
          ),
        },
        {
          field: 'nd',
          alwaysShow: true,
          label: '年度',
          render: (data) => <el-input placeholder="年度" vModel={data['nd']} />,
        },
        {
          field: 'bzbm',
          label: '编制部门',
          render: (data) => (
            <el-input placeholder="编制部门" vModel={data['bzbm']} />
          ),
        },
        {
          field: 'bzsj',
          label: '编制时间',
          render: (data) => (
            <el-date-picker
              vModel={data['bzsj']}
              type="datetimerange"
              style="width:100%"
            ></el-date-picker>
          ),
        },
      ],
    }
  },
  methods: {
    getList() {
      this.list = [
        {
          id: '01',
          djmc: '2020年度计划启动',
          nd: '2020',
          bzkssj: '2019/10/02',
          bzjzsj: '2019/12/01',
          bzyq: '',
        },
      ]
    },
    // 点击新增
    onSearch() {
      console.log('listQuery', this.listQuery)
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
    onClickAdd() {
      this.$router.push('/bidding/biddingPlanSummary/form')
    },
    handleView() {
      this.$router.push('/bidding/biddingPlanSummary/form')
    },
  },
}
</script>
