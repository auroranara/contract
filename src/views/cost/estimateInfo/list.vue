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
          label="项目名称"
          prop="xmmc"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="线路"
          prop="xl"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="概算总额（万元）"
          prop="gsze"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="工程总量"
          prop="gczl"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="线路长度（公里）"
          prop="xlcd"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          align="center"
          label="技术经济指标（万元/正线公里）"
          prop="xlcd"
          :show-overflow-tooltip="true"
        ></el-table-column>

        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleView(scope.row)"
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
import Pagination from '@/components/Pagination'
import ExpandFilter from '@/components/ExpandFilter'

export default {
  name: 'estimateInfoList',
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
          field: 'xmmc',
          alwaysShow: true,
          label: '项目名称',
          render: (data) => (
            <el-input placeholder="项目名称" vModel={data['xmmc']} />
          ),
        },
        {
          field: 'xl',
          alwaysShow: true,
          label: '线路',
          render: (data) => <el-input placeholder="线路" vModel={data['xl']} />,
        },
      ],
    }
  },
  methods: {
    getList() {
      this.list = [
        {
          id: '01',
          xmmc: '无锡地铁4号线工程',
          xl: '无锡地铁4号线',
          gsze: '19213123',
          gczl: '60',
          jsjjzb: '2110',
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
      this.$router.push('/cost/estimateInfo/form')
    },
    handleView() {
      this.$router.push('/cost/estimateInfo/form')
    },
  },
}
</script>
