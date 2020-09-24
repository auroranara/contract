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
          <el-tab-pane name="jcxx" label="供应商信息">
            <block-title title="基础信息" />
            <grid-form :settings="baseSettings(this.detail)"></grid-form>
            <block-title title="银行信息" />
            <el-table :data="customerBankList" border>
              <!-- <el-table-column prop="isPrimaryAccount" label="是否主账户" align="center">
                <template slot-scope="scope">
                  <el-checkbox disabled :value="!!scope.row.isPrimaryAccount"></el-checkbox>
                </template>
              </el-table-column> -->
              <el-table-column prop="name" label="银行"></el-table-column>
              <el-table-column
                prop="branchBankName"
                label="分行"
              ></el-table-column>
              <el-table-column
                prop="bankAccount"
                label="银行账户"
              ></el-table-column>
              <el-table-column
                prop="relevanceBankNumber"
                label="联行号"
              ></el-table-column>
              <el-table-column prop="isPrimaryAccount" label="账户是否主要">
                <template slot-scope="scope">
                  {{ scope.row.isPrimaryAccount | judgeFilter }}
                </template>
              </el-table-column>
            </el-table>
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
            label="供应商名称"
            prop="name"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="供应商类型"
            prop="type"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="供应商类别"
            prop="category"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="供应商代码"
            prop="code"
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
import { judgeFilter } from '@/utils/filters'

export default {
  name: 'supplier',
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
          label: '供应商名称',
          render: (data) => (
            <el-input placeholder="供应商名称" vModel={data['name']} />
          ),
        },
        {
          field: 'type',
          alwaysShow: true,
          label: '供应商类型',
          render: (data) => (
            <el-input placeholder="供应商类型" vModel={data['type']} />
          ),
        },
        {
          field: 'category',
          label: '供应商类别',
          alwaysShow: true,
          render: (data) => (
            <el-input placeholder="供应商类别" vModel={data['category']} />
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
      customerBankList: [],
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
            label: '供应商名称',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.name,
          },
          {
            type: 'label',
            label: '供应商代码',
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
            label: '供应商主键',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.id,
          },
          {
            type: 'label',
            label: '供应商标识',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.logo,
          },
        ],
        [
          {
            type: 'label',
            label: '供应商类别',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.category,
          },
          {
            type: 'label',
            label: '供应商类型',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.type,
          },
        ],
        [
          {
            type: 'label',
            label: '是否关联方',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => judgeFilter(data.isRelevance),
          },
          {
            type: 'label',
            label: '统一社会信用代码',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.socialCreditCode,
          },
        ],
        [
          {
            type: 'label',
            label: '国家',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.country,
          },
          {
            type: 'label',
            label: '省/自治区',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.province,
          },
        ],
        [
          {
            type: 'label',
            label: '市',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.city,
          },
          {
            type: 'label',
            label: '是否禁用',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => judgeFilter(data.isDisabled),
          },
        ],
        [
          {
            type: 'label',
            label: '启用日期',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.enableTime,
          },
          {
            type: 'label',
            label: '失效日期',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.disableTime,
          },
        ],
      ]
    },
    // 获取左侧树
    getTreeList() {
      this.treeList = [
        {
          id: '1',
          label: '供应商',
          children: [
            {
              id: '1-1',
              label: '供应商1',
            },
            {
              id: '1-2',
              label: '供应商2',
            },
            {
              id: '1-3',
              label: '供应商3',
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
          label: '供应商1',
          name: '无锡广大汽车租赁有限公司',
          code: 'GYS000000002',
          logo: '201901121012-F5D3-1C6',
          category: '监理',
          type: '工程类',
          isRelevance: 1,
          socialCreditCode: '9121123213213123123',
          country: 'CN',
          province: '江苏',
          city: '无锡',
          isDisabled: 0,
          enableTime: '2020-02-12',
          disableTime: '2025-02-12',
          zt: '审批完成',
          cjsj: '2019/02/02 18:10',
          cjr: '张三',
          xgsj: '2019/02/02 18:10',
          xgr: '张三',
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
      this.$refs.treeNode.setCurrentKey(data[this.rowKey])
      // TODO 点击设置右侧显示参数
      this.detail = {
        id: '1-1',
        name: '无锡广大汽车租赁有限公司',
        code: 'GYS000000002',
        logo: '201901121012-F5D3-1C6',
        category: '监理',
        type: '工程类',
        isRelevance: 1,
        socialCreditCode: '9121123213213123123',
        country: 'CN',
        province: '江苏',
        city: '无锡',
        isDisabled: 0,
        enableTime: '2020-02-12',
        disableTime: '2025-02-12',
      }
      this.systemData = {
        status: '审批完成',
        createTime: '2019/02/02 18:10',
        createPerson: '张三',
        modifyTime: '2019/02/02 18:10',
        modifyPerson: '张三',
      }
      this.customerBankList = [
        {
          id: '1',
          isPrimaryAccount: 1,
          name: '交通银行',
          branchBankName: '交通银行青山支行',
          bankAccount: '6058182298765512',
          relevanceBankNumber: '103120230',
        },
      ]
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
</style>
