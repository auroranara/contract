<template>
  <div class="app-container">
    <div class="head-container">
      <!-- <el-button
        plain
        type="primary"
        icon="el-icon-search"
        @click="handleViewSearch"
        >查询</el-button
      > -->
      <el-button :disabled="!saveAuth" plain type="primary" @click="onSave">
        保存
      </el-button>
      <el-button :disabled="!submitAuth" plain type="primary" @click="onSubmit">
        提交
      </el-button>
      <el-button :disabled="!checkAuth" plain type="primary">审核</el-button>
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
              @node-click="onTreeNodeClick"
              :node-key="rowKey"
            ></el-tree>
          </el-scrollbar>
        </el-card>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="18">
        <el-tabs type="border-card" v-model="tabKey">
          <el-tab-pane name="jcxx" label="客户信息">
            <block-title title="基础信息" />
            <grid-form
              ref="gridForm"
              :settings="baseSettings(this.detail)"
              :model="detail"
            ></grid-form>
            <block-title title="银行信息" />
            <el-table style="margin-top: 10px" :data="customerBankList" border>
              <el-table-column
                type="selection"
                width="55"
                align="center"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="isPrimaryAccount"
                label="是否主账户"
                align="center"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    :value="!!scope.row.isPrimaryAccount"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                prop="headOfficeName"
                label="总行信息"
                :show-overflow-tooltip="true"
                align="center"
              ></el-table-column>
              <el-table-column
                width="150"
                prop="openBank"
                label="开户行"
                :show-overflow-tooltip="true"
                align="center"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="province"
                label="省"
                :show-overflow-tooltip="true"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.province }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                prop="city"
                label="市"
                :show-overflow-tooltip="true"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.city }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                prop="branchOfficeName"
                label="分行名称"
                :show-overflow-tooltip="true"
                align="center"
              ></el-table-column>
              <el-table-column
                width="150"
                prop="correspondentNo"
                label="联行号"
                :show-overflow-tooltip="true"
                align="center"
              ></el-table-column>
              <el-table-column
                width="100"
                prop="accountHolder"
                label="开户人"
                :show-overflow-tooltip="true"
                align="center"
              ></el-table-column>
              <el-table-column
                width="150"
                prop="esignature"
                label="电子签章"
                :show-overflow-tooltip="true"
                align="center"
              ></el-table-column>
              <el-table-column
                width="150"
                prop="isReceiveTicket"
                label="是否接受电子银票"
                align="center"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.isReceiveTicket }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                prop="remarks"
                label="备注"
                :show-overflow-tooltip="true"
                align="center"
              ></el-table-column>
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
            label="客户名称"
            prop="customerName"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="状态"
            prop="status"
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
import { mapState } from 'vuex'
import {
  fetchAdjustList,
  fetchAdjustListByPage,
  fetchAdjustDetail,
} from '@/api/baseInfo/client'

export default {
  name: 'clientAdjust',
  components: {
    ExpandFilter,
    GridForm,
    BlockTitle,
    Pagination,
    SystemInfo,
  },
  data() {
    return {
      basePath: '/baseInfo/client',
      // 列表数据的键值
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
      // 基础信息
      detail: {},
      // 系统信息
      systemData: {},
      // 查询弹窗是否可见
      queryDialogVisible: false,
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
      // 树筛选内容
      treeSearch: '',
      fields: [
        {
          field: 'customerName',
          alwaysShow: true,
          label: '客户名称',
          render: (data) => (
            <el-input placeholder="客户名称" vModel={data['customerName']} />
          ),
        },
        {
          field: 'status',
          label: '状态',
          alwaysShow: true,
          render: (data) => (
            <el-select vModel={data['status']}>
              {this.statusDict.map(({ value, label }) => (
                <el-option key={value} value={value} label={label}></el-option>
              ))}
            </el-select>
          ),
        },
      ],
    }
  },
  computed: {
    ...mapState({
      statusDict: (state) => state.baseInfo.statusDict,
    }),
    // 保存权限
    saveAuth() {
      return (
        +this.detail.status === 1 &&
        !!this.detail.isDisabled &&
        !this.detail.version === 'V0.0.0'
      )
    },
    // 提交权限
    submitAuth() {
      return (
        +this.detail.status === 1 &&
        !!this.detail.isDisabled &&
        !this.detail.version === 'V0.0.0'
      )
    },
    // 审核权限
    checkAuth() {
      return +this.detail.status === 2 && !this.detail.version === 'V0.0.0'
    },
    // 是否可操作
    canOperate() {
      return (
        +this.detail.status === 1 &&
        !!this.detail.isDisabled &&
        !this.detail.version === 'V0.0.0'
      )
    },
  },
  watch: {
    treeSearch(value) {
      this.$refs.treeNode.filter(value)
    },
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
            label: '客户名称',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'customerName',
            render: (data) => <el-input vModel={data['customerName']} />,
          },
          {
            type: 'label',
            label: '客户编码',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'customerCode',
            disabled: true,
            render: (data) => (
              <el-input readonly vModel={data['customerCode']} />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '是否停用',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'isDisabled',
            render: (data) => (
              <el-radio-group vModel={data['isDisabled']}>
                <el-radio label={1}>是</el-radio>
                <el-radio label={0}>否</el-radio>
              </el-radio-group>
            ),
          },
          {
            type: 'empty',
            showBg: true,
          },
          {
            type: 'empty',
          },
        ],
        [
          {
            type: 'label',
            label: '是否关联方',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'isRelationship',
            render: (data) => (
              <el-radio-group vModel={data['isRelationship']}>
                <el-radio label={1}>是</el-radio>
                <el-radio label={0}>否</el-radio>
              </el-radio-group>
            ),
          },
          {
            type: 'label',
            label: '是否一般纳税人',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'isTaxpayer',
            render: (data) => (
              <el-radio-group vModel={data['isTaxpayer']}>
                <el-radio label={1}>是</el-radio>
                <el-radio label={0}>否</el-radio>
              </el-radio-group>
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '开票抬头',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'invoiceTitle',
            render: (data) => <el-input vModel={data['invoiceTitle']} />,
          },
          {
            type: 'label',
            label: '统一社会信用代码',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'socialCreditCode',
            render: (data) => <el-input vModel={data['socialCreditCode']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '国家',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'country',
            render: (data) => <el-input vModel={data['country']} />,
          },
          {
            type: 'label',
            label: '省/自治区',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'province',
            render: (data) => <el-input vModel={data['province']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '市',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'city',
            render: (data) => <el-input vModel={data['city']} />,
          },
          {
            type: 'label',
            label: '地址、电话',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'addressPhone',
            render: (data) => <el-input vModel={data['addressPhone']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '调整原因',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'adjustReason',
            colspan: '3',
            render: (data) => (
              <el-input type="textarea" vModel={data['adjustReason']} />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '调整说明',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'adjustExplain',
            colspan: '3',
            render: (data) => (
              <el-input type="textarea" vModel={data['adjustExplain']} />
            ),
          },
        ],
      ]
    },
    // 获取左侧树
    async getTreeList() {
      const res = await fetchAdjustList()
      this.treeList = res.data.map(
        ({ customerId, customerName, versionList, ...resItems }) => ({
          ...resItems,
          id: customerId,
          label: customerName,
          isCustomer: true,
          children: this.generateNode(versionList),
        })
      )
    },
    generateNode(child) {
      return Array.isArray(child) && child.length
        ? child.map(({ id, version }, index) => ({
            id,
            label: version,
            isLatest: child.length - 1 === index,
          }))
        : []
    },
    // 初始化
    async init() {
      await this.getTreeList()
      const { id } = this.$route.query || {}
      if (id) {
        this.fetchDetail({ id })
        this.currentKey = id
        this.$refs.treeNode.setCurrentKey(id)
      }
    },
    // 获取查询列表（分页）
    async getList() {
      this.listLoading = true
      const res = await fetchAdjustListByPage(this.listQuery)
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
    onResetInfo() {
      this.$refs['gridForm'].$refs['form'].resetFields()
      this.detail = {}
      this.systemData = {}
      this.customerBankList = []
      this.$refs.treeNode.setCurrentKey()
      this.currentKey = null
    },
    handleViewSearch() {
      this.queryDialogVisible = true
      this.listQuery = {
        page: 1,
        limit: 10,
      }
      this.list = []
    },
    onTreeNodeClick(data) {
      if (data.isCustomer) return
      this.$refs['gridForm'].$refs['form'].resetFields()
      const id = data[this.rowKey]
      this.currentKey = id
      this.$refs.treeNode.setCurrentKey(id)
      this.$router.replace(`${this.basePath}/adjust`)
      // 获取详情
      this.fetchDetail({ id })
    },
    // 获取详情
    async fetchDetail(query) {
      const res = await fetchAdjustDetail(query)
      this.detail = res && res.data ? res.data : {}
      this.systemData = res && res.data ? res.data : {}
      this.customerBankList =
        res && res.data && res.data.customerBankList
          ? res.data.customerBankList
          : []
    },
    // 查询中选中信息
    onSelect(row) {
      const id = data[this.rowKey]
      this.$refs.treeNode.setCurrentKey(id)
      this.$refs['gridForm'].$refs['form'].resetFields()
      this.currentKey = id
      this.$refs.treeNode.setCurrentKey(id)
      this.$router.replace(`${this.basePath}/adjust`)
      // 获取详情
      this.fetchDetail({ id })
      this.queryDialogVisible = false
    },
    // 树筛选函数 默认对label筛选
    filterTree(value, data) {
      if (!value) return true
      return data[this.treeProps.label].indexOf(value) !== -1
    },
    // 点击保存
    onSave() {
      this.$refs['gridForm'].$refs['form'].validate(async (valid, err) => {
        this.notify && this.notify.close()
        if (!valid) {
          const msg = Object.entries(err)
            .map((item) => item[1].map((val) => val.message).join('，'))
            .join('\n')
          this.$notify.error({
            title: '基础信息校验错误',
            message: this.$createElement(
              'div',
              { style: 'white-space:pre-wrap' },
              msg
            ),
            duration: 20000,
          })
        } else {
          // saveType 1保存 2提交
          // submitStatus  --  提交状态  0新增-保存  1新增-提交  2调整-保存  3调整-提交
          const payload = {
            ...this.detail,
            saveType: 1,
            isAdjust: Number(this.isAdjust),
            customerBankList: this.customerBankList.map(
              ({ tempId, ...resValues }) => resValues
            ),
            submitStatus: 2,
          }
          const res = await addClient(payload)
          if (res && res.status === 200) {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000,
            })
            this.onResetInfo()
            this.getTreeList()
          }
        }
      })
    },
    // 点击提交
    onSubmit() {
      this.$refs['gridForm'].$refs['form'].validate(async (valid, err) => {
        this.notify && this.notify.close()
        if (!valid) {
          const msg = Object.entries(err)
            .map((item) => item[1].map((val) => val.message).join('，'))
            .join('\n')
          this.$notify.error({
            title: '基础信息校验错误',
            message: this.$createElement(
              'div',
              { style: 'white-space:pre-wrap' },
              msg
            ),
            duration: 20000,
          })
        } else {
          // submitStatus  --  提交状态  0新增-保存  1新增-提交  2调整-保存  3调整-提交
          const payload = {
            ...this.detail,
            saveType: 2,
            isAdjust: Number(this.isAdjust),
            customerBankList: this.customerBankList.map(
              ({ tempId, ...resValues }) => resValues
            ),
            submitStatus: 3,
          }
          const res = await addClient(payload)
          if (res && res.status === 200) {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000,
            })
            this.onResetInfo()
            this.getTreeList()
          }
        }
      })
    },
  },
}
</script>
<style lang="scss">
// .dialog-content {
//   min-height: 350px;
// }
.tree-select-wrapper {
  .scrollbar-wrapper {
    max-height: 475px;
  }
  .el-card__body {
    padding: 20px 10px;
  }
}
</style>
