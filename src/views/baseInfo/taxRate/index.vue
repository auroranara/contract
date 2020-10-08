<template>
  <div class="app-container">
    <div class="head-container">
      <el-button
        plain
        type="primary"
        icon="el-icon-search"
        @click="handleViewSearch"
        >查询</el-button
      >
    </div>
    <el-row :gutter="10">
      <!-- 左侧树 -->
      <el-col :span="6">
        <el-card class="tree-select-wrapper">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-tree
              ref="treeNode"
              :highlight-current="true"
              :data="treeList"
              :props="treeProps"
              :default-expand-all="true"
              @node-click="onTreeNodeClick"
              :node-key="rowKey"
            ></el-tree>
          </el-scrollbar>
        </el-card>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="18">
        <el-tabs type="border-card" v-model="tabKey">
          <el-tab-pane name="jcxx" label="税率信息">
            <block-title title="基础信息" />
            <grid-form :settings="baseSettings(this.detail)"></grid-form>
          </el-tab-pane>
          <el-tab-pane name="xtxx" label="系统信息">
            <system-info :data="systemData" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <el-dialog width="70%" title="查询" :visible.sync="queryDialogVisible">
      <div class="dialog-content">
        <expand-Filter
          :fields="fields"
          :model="listQuery"
          type="inline"
          :showLabel="false"
          :showExpand="false"
        >
          <template v-slot:operations>
            <el-button type="primary" icon="el-icon-search" @click="onSearch"
              >查询</el-button
            >
            <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
          </template>
        </expand-Filter>
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          highlight-current-row
          style="width: 100%"
          @row-click="onSelect"
        >
          <el-table-column
            align="center"
            label="税率名称"
            prop="taxRateName"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="税率代码"
            prop="taxRateCode"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="启用时间"
            prop="effectiveTo"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="失效时间"
            prop="effectiveFrom"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="onSelect(scope.row)" type="text"
                >选择</el-button
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
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ExpandFilter from '@/components/ExpandFilter'
import GridForm from '@/components/GridForm'
import BlockTitle from '@/components/BlockTitle'
import Pagination from '@/components/Pagination'
import SystemInfo from '@/components/SystemInfo'
import { fetchListByPage, fetchList, fetchDetail } from '@/api/baseInfo/taxRate'

export default {
  name: 'taxRate',
  components: {
    ExpandFilter,
    GridForm,
    BlockTitle,
    Pagination,
    SystemInfo,
  },
  data() {
    return {
      rowKey: 'id',
      // 当前tab的key
      tabKey: 'jcxx',
      listLoading: false,
      // 查询query信息
      listQuery: {
        page: 1,
        limit: 10,
      },
      total: 0,
      // 查询弹窗是否可见
      queryDialogVisible: false,
      fields: [
        {
          field: 'taxRateName',
          alwaysShow: true,
          label: '税率名称',
          render: (data) => (
            <el-input placeholder="税率名称" vModel={data['taxRateName']} />
          ),
        },
        {
          field: 'taxRateCode',
          alwaysShow: true,
          label: '税率代码',
          render: (data) => (
            <el-input placeholder="税率代码" vModel={data['taxRateCode']} />
          ),
        },
      ],
      // 基础信息
      detail: {},
      // 系统信息
      systemData: {},
      treeProps: {
        children: 'children',
        label: 'taxRateName',
      },
      // 左侧树
      treeList: [],
      // 弹窗查询列表
      list: [],
      currentKey: null,
    }
  },
  created() {
    this.init()
  },
  methods: {
    baseSettings(data) {
      return [
        [
          {
            type: 'label',
            label: '税率名称',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.taxRateName,
          },
          {
            type: 'label',
            label: '税率代码',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.taxRateCode,
          },
        ],
        [
          {
            type: 'label',
            label: '启用时间',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.effectiveTo,
          },
          {
            type: 'label',
            label: '失效时间',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.effectiveFrom,
          },
        ],
      ]
    },
    // 获取左侧树
    async getTreeList() {
      const res = await fetchList()
      this.treeList = res.data || []
    },
    // 初始化
    init() {
      this.getTreeList()
    },
    // 获取查询列表（分页）
    async getList() {
      this.listLoading = true
      const res = await fetchListByPage(this.listQuery)
      this.list = res && res.data ? res.data : []
      this.total = res ? res.total : 0
      this.listLoading = false
    },
    onSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    onReset() {
      this.listQuery = {
        page: 1,
        limit: 10,
      }
      this.getList()
    },
    // 点击打开查询弹窗
    handleViewSearch() {
      this.queryDialogVisible = true
      this.listQuery = {
        page: 1,
        limit: 10,
      }
      this.list = []
    },
    // 点击左侧树
    async onTreeNodeClick(data) {
      const id = data[this.rowKey]
      this.$refs.treeNode.setCurrentKey(id)
      const res = await fetchDetail({ id })
      this.detail = res && res.data ? res.data : {}
      this.systemData = res && res.data ? res.data : {}
    },
    onSelect(row) {
      this.onTreeNodeClick(row)
      this.queryDialogVisible = false
    },
  },
}
</script>
