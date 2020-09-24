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
      <el-button plain type="primary">审核</el-button>
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
          <el-tab-pane name="jcxx" label="客户信息">
            <block-title title="基础信息" />
            <grid-form
              ref="gridForm"
              :settings="baseSettings(this.detail)"
              :model="detail"
              :rules="rules"
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

export default {
  name: 'client',
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
      // 银行信息中选中的对象
      selectedBank: [],
      rules: {
        customerName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
        ],
        isRelationship: [
          { required: true, message: '请输入是否关联方', trigger: 'blur' },
        ],
      },
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
    // 当前状态 可选值 add adjust detail
    type() {
      return this.$route.query.type || 'detail'
    },
    isAdd() {
      return this.type === 'add'
    },
    isAdjust() {
      return this.type === 'adjust'
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
            disabled: true,
            render: (data) => (
              <el-input readonly vModel={data['customerName']} />
            ),
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
            disabled: true,
            render: (data) => (
              <el-radio-group disabled vModel={data['isDisabled']}>
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
            disabled: true,
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
            disabled: true,
            render: (data) => (
              <el-radio-group disabled vModel={data['isRelationship']}>
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
            disabled: true,
            render: (data) => (
              <el-radio-group disabled vModel={data['isTaxpayer']}>
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
            disabled: true,
            render: (data) => (
              <el-input readonly vModel={data['invoiceTitle']} />
            ),
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
            disabled: true,
            render: (data) => (
              <el-input readonly vModel={data['socialCreditCode']} />
            ),
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
            disabled: true,
            render: (data) => (
              <el-select
                disabled
                placeholder=""
                vModel={data['country']}
                style="width:100%"
              ></el-select>
            ),
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
            disabled: true,
            render: (data) => (
              <el-select
                disabled
                placeholder=""
                vModel={data['province']}
                style="width:100%"
              ></el-select>
            ),
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
            disabled: true,
            render: (data) => (
              <el-select
                disabled
                placeholder=""
                vModel={data['city']}
                style="width:100%"
              ></el-select>
            ),
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
            disabled: true,
            render: (data) => (
              <el-input readonly vModel={data['addressPhone']} />
            ),
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
            disabled: true,
            render: (data) => (
              <el-input
                readonly
                type="textarea"
                vModel={data['adjustReason']}
              />
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
            disabled: true,
            render: (data) => (
              <el-input
                readonly
                type="textarea"
                vModel={data['adjustExplain']}
              />
            ),
          },
        ],
      ]
    },
    // 获取左侧树
    getTreeList() {
      this.treeList = [
        {
          id: '1',
          label: '客户',
          children: [
            {
              id: '1-1',
              label: '客户1',
            },
            {
              id: '1-2',
              label: '客户2',
            },
            {
              id: '1-3',
              label: '客户3',
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
          key: '1',
          customerName: '江苏普信土地房地产资产评估测绘有限公司',
          status: '审批完成',
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
    onResetInfo() {
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
      this.currentKey = data[this.rowKey]
      // TODO 点击设置右侧显示参数
      this.detail = {
        customerName: '无锡普信土地资产评估测绘有限公司',
        customerCode: 'JS0099156',
        isRelationship: 1,
        isTaxpayer: 1,
        invoiceTitle: '江苏普信土地房地产资产评估测绘有限公司',
        socialCreditCode: '912000123213F',
        country: '中国',
        province: '江苏',
        city: '无锡',
        addressPhone: '无锡新区旺庄路52-2101232',
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
          headOfficeName: '交通银行',
          openBank: '交通银行青山支行',
          province: '江苏省',
          city: '无锡市',
          branchOfficeName: '交通银行股份有限公司',
          yhzh: '6058182298765512',
          correspondentNo: '103120230',
        },
      ]
    },
    // 查询中选中信息
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
