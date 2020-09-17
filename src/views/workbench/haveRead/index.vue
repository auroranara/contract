<template>
  <div class="app-container">
    <div class="head-container">
      <el-card>
        <expand-Filter :fields="fields" :model="listQuery" :layout="{md:8,sm:24}">
          <template v-slot:operations>
            <el-button type="primary" icon="el-icon-search" @click="onSearch">筛选</el-button>
            <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
          </template>
        </expand-Filter>
      </el-card>
    </div>
    <el-card>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column align="center" label="序号" width="80">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column align="center" label="工作阶段" prop="gzjd" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="center" label="已阅事项" prop="yysx" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false">{{scope.row.yysx}}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="单据类型" prop="djlx" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="center" label="单据名称" prop="djmc" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="center" label="结束时间" prop="jssj" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column align="center" label="备注" prop="bz" :show-overflow-tooltip="true"></el-table-column>
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

export default {
  name: 'toBeRead',
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
      },
      total: 0,
      list: [],
      fields: [
        {
          field: 'gzjd',
          alwaysShow: true,
          label: '工作阶段',
          render: (data) => (
            <el-input placeholder="工作阶段" vModel={data['gzjd']} />
          ),
        },
        {
          field: 'yysx',
          alwaysShow: true,
          label: '已阅事项',
          render: (data) => (
            <el-input placeholder="已阅事项" vModel={data['yysx']} />
          ),
        },
        {
          field: 'djlx',
          alwaysShow: true,
          label: '单据类型',
          render: (data) => (
            <el-input placeholder="单据类型" vModel={data['djlx']} />
          ),
        },
        {
          field: 'djmc',
          label: '单据名称',
          render: (data) => (
            <el-input placeholder="单据名称" vModel={data['djmc']} />
          ),
        },
        {
          field: 'jssj',
          label: '结束时间',
          render: (data) => (
            <el-date-picker
              style="width:100%"
              vModel={data['jssj']}
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
    getList() {
      this.list = [
        {
          gzjd: '招标阶段',
          yysx: '控制价清单审核',
          djlx: '招标控制价',
          djmc: '无锡地铁具区路车辆段基础工程',
          jssj: '2020-07-06 13:23:12',
          bz: '',
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
  },
}
</script>
