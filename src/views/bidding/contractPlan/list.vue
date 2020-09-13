<template>
  <div class="app-container">
    <div class="head-container">
      <expand-Filter :fields="fields" :model="listQuery">
        <template v-slot:operations>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
          <el-dropdown split-button type="primary" @click="onClickAdd">
            新增
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>批量导出</el-dropdown-item>
              <el-dropdown-item>批量导入</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </expand-Filter>
    </div>
    <el-card>
      <!--表格渲染-->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column align="center" label="序号" width="80" type="index">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="标段名称" prop="bdmc" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column align="center" label="合同产生方式" prop="htcsfs" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column align="center" label="招标分类" prop="zbfl" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column align="center" label="专业分类" prop="zyfl" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column align="center" label="项目名称" prop="xmmc" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column align="center" label="主办单位" prop="zbdw" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column align="center" label="主办部门" prop="zbbm" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column align="center" label="主办人员" prop="zbry" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column align="center" label="招标方式" prop="zbfs" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column align="center" label="招标组织形式" prop="zbzzxs" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column align="center" label="计划开始时间" prop="jhkssj" :show-overflow-tooltip="true"></el-table-column>

        <!-- <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            v-permission="['projectInfo:edit']"
            size="mini"
            icon="el-icon-edit"
            type="primary"
            @click="detail(scope.row.id)"
            >编辑</el-button
          >
        </template>
        </el-table-column>-->
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
  name: 'contractPlanList',
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
          field: 'bdmc',
          alwaysShow: true,
          label: '标段名称',
          render: (data) => (
            <el-input placeholder="标段名称" vModel={data['bdmc']} />
          ),
        },
        {
          field: 'htcsfs',
          alwaysShow: true,
          label: '合同产生方式',
          render: (data) => (
            <el-input placeholder="合同产生方式" vModel={data['htcsfs']} />
          ),
        },
        {
          field: 'zbfl',
          alwaysShow: true,
          label: '招标分类',
          render: () => (
            <el-input placeholder="招标分类" vModel={this.listQuery['zbfl']} />
          ),
        },
        {
          field: 'zyfl',
          alwaysShow: true,
          label: '专业分类',
          render: () => (
            <el-input placeholder="专业分类" vModel={this.listQuery['zyfl']} />
          ),
        },
        {
          field: 'xmmc',
          label: '项目名称',
          render: () => (
            <el-input placeholder="项目名称" vModel={this.listQuery['xmmc']} />
          ),
        },
        {
          field: 'zbdw',
          label: '主办单位',
          render: () => (
            <el-input placeholder="主办单位" vModel={this.listQuery['zbdw']} />
          ),
        },
        {
          field: 'zbbm',
          label: '主办部门',
          render: () => (
            <el-input placeholder="主办部门" vModel={this.listQuery['zbbm']} />
          ),
        },
        {
          field: 'zbry',
          label: '主办人员',
          render: () => (
            <el-input placeholder="主办人员" vModel={this.listQuery['zbry']} />
          ),
        },
        {
          field: 'zbfs',
          label: '招标方式',
          render: () => (
            <el-input placeholder="招标方式" vModel={this.listQuery['zbfs']} />
          ),
        },
        {
          field: 'zbzzxs',
          label: '招标组织形式',
          render: () => (
            <el-input
              placeholder="招标组织形式"
              vModel={this.listQuery['zbzzxs']}
            />
          ),
        },
        {
          field: 'jhkasj',
          label: '计划开始时间',
          render: () => (
            <el-date-picker
              vModel={this.listQuery['jhkasj']}
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%"
            ></el-date-picker>
          ),
        },
      ],
    }
  },
  methods: {
    getList() {},
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
      this.$router.push('/bidding/contractPlan/form')
    },
  },
}
</script>
