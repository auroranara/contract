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
          <el-tab-pane name="bdxx" label="标段信息">
            <block-title title="基础信息" />
            <grid-form :settings="baseSettings(this.detail)"></grid-form>

            <el-tabs>
              <el-tab-pane label="规费">
                <el-table :data="singleProjectList" border>
                  <el-table-column
                    align="center"
                    label="子单位工程名称"
                    prop="childSingleProName"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    label="规费"
                    prop="charges"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    label="备注"
                    prop="chargesRemark"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="子单位工程">
                <el-table :data="singleProjectList" border>
                  <el-table-column
                    align="center"
                    label="单项工程名称"
                    prop="singleProName"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    label="子单位工程名称"
                    prop="childSingleProName"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    label="规费"
                    prop="charges"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    label="备注"
                    prop="childSingleRemark"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="单项工程">
                <el-table :data="singleProjectList" border>
                  <el-table-column
                    align="center"
                    label="单项工程名称"
                    prop="singleProName"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    label="子单位工程名称"
                    prop="childSingleProName"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                  <el-table-column
                    align="center"
                    label="备注"
                    prop="singleRemark"
                    :show-overflow-tooltip="true"
                  ></el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane name="xtxx" label="系统信息">
            <system-info :data="systemData" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!-- 查询弹窗 -->
    <el-dialog width="70%" title="查询" :visible.sync="queryDialogVisible">
      <div class="dialog-content">
        <expand-Filter
          :fields="fields"
          :model="listQuery"
          type="inline"
          :showLabel="false"
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
            width="80"
            align="center"
            label="序号"
            type="index"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="标段名称"
            prop="sectionName"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="合同分类"
            prop="classifyName"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="线路"
            prop="line"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="150"
            align="center"
            label="是否材料标段"
            prop="isMaterialSection"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="建设单位"
            prop="constructionUnit"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="主管部门"
            prop="competentDept"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="施工单位"
            prop="workUnit"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="监理单位"
            prop="supervisionUnit"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="150"
            align="center"
            label="计量支付比率"
            prop="meteringRate"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="状态"
            prop="zt"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            fixed="right"
            align="center"
            label="操作"
          >
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
import TreeSelect from '@/components/TreeSelect'
import { mapState } from 'vuex'
import { judgeFilter } from '@/utils/filters'
import {
  fetchListByPage,
  fetchList,
  fetchDetail,
} from '@/api/baseInfo/bidStage'
import { fetchList as fetchConstractTypes } from '@/api/baseInfo/constractType'

export default {
  name: 'bidStage',
  components: {
    ExpandFilter,
    GridForm,
    BlockTitle,
    Pagination,
    SystemInfo,
    TreeSelect,
  },
  data() {
    return {
      // 列表数据的键值
      rowKey: 'id',
      // 当前tab的key
      tabKey: 'bdxx',
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
          field: 'sectionName',
          alwaysShow: true,
          label: '标段名称',
          render: (data) => (
            <el-input placeholder="标段名称" vModel={data['sectionName']} />
          ),
        },
        {
          field: 'classifyId',
          alwaysShow: true,
          label: '合同分类',
          render: (data) => (
            <tree-select
              vModel={data['classifyId']}
              treeProps={this.constractTreeProps}
              options={this.constractTypeList}
              placeholder="合同分类"
              showFilter
            />
          ),
        },
        {
          field: 'line',
          label: '线路',
          render: (data) => (
            <el-input placeholder="线路" vModel={data['line']} />
          ),
        },
        {
          field: 'status',
          label: '状态',
          render: (data) => (
            <el-select placeholder="状态" vModel={data['status']}>
              {this.statusDict.map(({ value, label }) => (
                <el-option key={value} value={value} label={label}></el-option>
              ))}
            </el-select>
          ),
        },
      ],
      // 基础信息
      detail: {},
      // 系统信息
      systemData: {},
      singleProjectList: [],
      treeProps: {
        children: 'children',
        label: 'sectionName',
      },
      // 左侧树
      treeList: [],
      // 弹窗查询列表
      list: [],
      currentKey: null,
      // 合同分类树
      constractTypeList: [],
      constractTreeProps: {
        children: 'childrenCategoryList',
        label: 'classifyName',
        value: 'id',
      },
    }
  },
  computed: {
    ...mapState({
      statusDict: (state) => state.baseInfo.statusDict,
    }),
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
            label: '标段名称',
            showBg: true,
            tdStyle: {
              width: '150px',
            },
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.sectionName,
          },
          {
            type: 'label',
            label: '标段编码',
            showBg: true,
            tdStyle: {
              width: '180px',
            },
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.sectionCode,
          },
        ],
        [
          {
            type: 'label',
            label: '合同编号',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.contractCode,
          },
          {
            type: 'label',
            label: '合同分类',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.classifyName,
          },
        ],
        [
          {
            type: 'label',
            label: '线路',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.line,
          },
          {
            type: 'label',
            label: '是否材料标段',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => judgeFilter(data.isMaterialSection),
          },
        ],
        [
          {
            type: 'label',
            label: '建设单位',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.constructionUnit,
          },
          {
            type: 'label',
            label: '建设单位负责人',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.cuPrincipal,
          },
        ],
        [
          {
            type: 'label',
            label: '主管部门',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.competentDept,
          },
          {
            type: 'label',
            label: '项目负责人',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.principal,
          },
        ],
        [
          {
            type: 'label',
            label: '施工单位',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.workUnit,
          },
          {
            type: 'label',
            label: '施工单位负责人',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.wuPrincipal,
          },
        ],
        [
          {
            type: 'label',
            label: '监理单位',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.supervisionUnit,
          },
          {
            type: 'label',
            label: '监理单位负责人',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.suPrincipal,
          },
        ],
        [
          {
            type: 'label',
            label: '预算工程师',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.budgeEnginner,
          },
          {
            type: 'empty',
            disabled: true,
            colspan: '2',
          },
        ],
        [
          {
            type: 'label',
            label: '概算总额（万元）',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.estimateTotal,
          },
          {
            type: 'label',
            label: '计量支付比率（%）',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.meteringRate,
          },
        ],
        [
          {
            type: 'label',
            label: '开工日期',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.startDate,
          },
          {
            type: 'label',
            label: '竣工日期',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.completedDate,
          },
        ],
        [
          {
            type: 'label',
            label: '备注',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.remarks,
            colspan: '3',
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
      this.fetchConstractTypes()
    },
    // 获取查询列表（分页）
    async getList() {
      this.listLoading = true
      const res = await fetchListByPage(this.listQuery)
      this.list = res && res.data ? res.data : []
      this.total = res ? res.total : 0
      this.listLoading = false
    },
    // 获取合同分类树
    async fetchConstractTypes() {
      const res = await fetchConstractTypes()
      this.constractTypeList = res.data || []
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
    async onTreeNodeClick(data) {
      const id = data[this.rowKey]
      this.currentKey = id
      this.$refs.treeNode.setCurrentKey(id)
      // 获取详情
      const res = await fetchDetail({ id })
      this.detail = res.data || {}
      this.systemData = res.data || {}
      this.singleProjectList = res.singleProjectList || []
    },
    onSelect(row) {
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
.mt15 {
  margin-top: 15px;
}
</style>
