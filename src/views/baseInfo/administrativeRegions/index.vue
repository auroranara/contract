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
        <el-card>
          <el-tree
            ref="treeNode"
            :highlight-current="true"
            :data="treeList"
            :props="treeProps"
            :default-expand-all="true"
            @node-click="onTreeNodeClick"
            :node-key="rowKey"
          ></el-tree>
        </el-card>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="18">
        <el-tabs type="border-card" v-model="tabKey">
          <el-tab-pane name="jcxx" label="行政区域信息">
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
            label="行政区域名称"
            prop="name"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="行政区域代码"
            prop="code"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="是否有效"
            prop="isValue"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.isValue | judgeFilter }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="是否作废"
            prop="isCancel"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.isCancel | judgeFilter }}
            </template>
          </el-table-column>
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
import { judgeFilter } from '@/utils/filters'

export default {
  name: 'organization',
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
          field: 'name',
          alwaysShow: true,
          label: '行政区域名称',
          render: (data) => (
            <el-input placeholder="行政区域名称" vModel={data['name']} />
          ),
        },
        {
          field: 'code',
          alwaysShow: true,
          label: '行政区域代码',
          render: (data) => (
            <el-input placeholder="行政区域代码" vModel={data['code']} />
          ),
        },
      ],
      // 基础信息
      detail: {},
      // 系统信息
      systemData: {},
      treeProps: {
        children: 'children',
        label: 'label',
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
            label: '行政区域名称',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.name,
          },
          {
            type: 'label',
            label: '行政区域代码',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.code,
          },
        ],
        [
          {
            type: 'label',
            label: '是否有效',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => judgeFilter(data.isValue),
          },
          {
            type: 'label',
            label: '是否作废',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => judgeFilter(data.isCancel),
          },
        ],
      ]
    },
    // 获取左侧树
    getTreeList() {
      this.treeList = [
        {
          id: '1',
          label: '行政区域',
          children: [
            {
              id: '1-1',
              label: '行政区域1',
            },
            {
              id: '1-2',
              label: '行政区域2',
            },
            {
              id: '1-3',
              label: '行政区域3',
            },
          ],
        },
      ]
    },
    // 初始化
    init() {
      this.getTreeList()
    },
    getList() {
      this.list = [
        {
          id: '1-1',
          name: '河北市',
          code: '110000',
          isValue: 1,
          isCancel: 1,
        },
      ]
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
    onTreeNodeClick(data) {
      this.currentKey = data[this.rowKey]
      // TODO 点击设置右侧显示参数
      this.detail = {
        key: '1-1',
        label: '河北市',
        name: '河北市',
        code: '110000',
        isValue: 1,
        isCancel: 1,
      }
      this.systemData = {
        status: '审批完成',
        createTime: '2019/02/02 18:10',
        createPerson: '张三',
        modifyTime: '2019/02/02 18:10',
        modifyPerson: '张三',
      }
    },
    onSelect(row) {
      this.$refs.treeNode.setCurrentKey(row[this.rowKey])
      this.onTreeNodeClick(row)
      this.queryDialogVisible = false
    },
  },
}
</script>
<style lang="scss" scoped>
.dialog-content {
  min-height: 350px;
}
</style>
