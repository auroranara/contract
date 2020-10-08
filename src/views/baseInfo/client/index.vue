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
      <el-button plain type="primary" @click="onClickAdd">新增</el-button>
      <el-button :disabled="!saveAuth" plain type="primary" @click="onSave">
        保存
      </el-button>
      <el-button
        :disabled="!adjustAuth"
        plain
        type="primary"
        @click="onClickAdjust"
      >
        调整
      </el-button>
      <el-button :disabled="!submitAuth" plain type="primary" @click="onSubmit">
        提交
      </el-button>
      <el-button
        :disabled="!checkAuth"
        plain
        type="primary"
        @click="handleViewCheck"
        >审核</el-button
      >
      <el-button
        :disabled="!deleteAuth"
        @click="handleDelete"
        plain
        type="primary"
        >删除</el-button
      >
    </div>
    <el-row :gutter="10">
      <!-- 左侧树 -->
      <el-col :span="6">
        <el-card class="tree-select-wrapper">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-tree
              v-loading="treeLoading"
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
              :rules="rules"
            ></grid-form>
            <block-title title="银行信息" />
            <el-button
              v-if="!saveAuth"
              size="small"
              type="primary"
              @click="addBank"
              >新增</el-button
            >
            <el-button
              v-if="!saveAuth"
              size="small"
              type="danger"
              :disabled="!(selectedBank && selectedBank.length)"
              @click="deleteBank"
              >删除</el-button
            >
            <el-table
              style="margin-top: 10px"
              :data="customerBankList"
              border
              @selection-change="handleBankChange"
            >
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
                    @change="onIsPrimaryChange(scope.$index)"
                  ></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                prop="headOfficeName"
                label="总行信息"
                :show-overflow-tooltip="isDetail"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!isDetail"
                    v-model="customerBankList[scope.$index].headOfficeName"
                  ></el-input>
                  <span v-else>{{ scope.row.headOfficeName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                prop="openBank"
                label="开户行"
                :show-overflow-tooltip="isDetail"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!isDetail"
                    v-model="customerBankList[scope.$index].openBank"
                  ></el-input>
                  <span v-else>{{ scope.row.openBank }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                prop="province"
                label="省"
                :show-overflow-tooltip="isDetail"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!isDetail"
                    v-model="customerBankList[scope.$index].province"
                  ></el-input>
                  <span v-else>{{ scope.row.province }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                prop="city"
                label="市"
                :show-overflow-tooltip="isDetail"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!isDetail"
                    v-model="customerBankList[scope.$index].city"
                  ></el-input>
                  <span v-else>{{ scope.row.city }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                prop="branchOfficeName"
                label="分行名称"
                :show-overflow-tooltip="isDetail"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!isDetail"
                    v-model="customerBankList[scope.$index].branchOfficeName"
                  ></el-input>
                  <span v-else>{{ scope.row.branchOfficeName }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                prop="correspondentNo"
                label="联行号"
                :show-overflow-tooltip="isDetail"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!isDetail"
                    v-model="customerBankList[scope.$index].correspondentNo"
                  ></el-input>
                  <span v-else>{{ scope.row.correspondentNo }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="100"
                prop="accountHolder"
                label="开户人"
                :show-overflow-tooltip="isDetail"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!isDetail"
                    v-model="customerBankList[scope.$index].accountHolder"
                  ></el-input>
                  <span v-else>{{ scope.row.accountHolder }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                prop="esignature"
                label="电子签章"
                :show-overflow-tooltip="isDetail"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!isDetail"
                    v-model="customerBankList[scope.$index].esignature"
                  ></el-input>
                  <span v-else>{{ scope.row.esignature }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                prop="isReceiveTicket"
                label="是否接受电子银票"
                align="center"
                :show-overflow-tooltip="isDetail"
              >
                <template slot-scope="scope">
                  <el-radio-group
                    v-if="!isDetail"
                    v-model="customerBankList[scope.$index].isReceiveTicket"
                  >
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                  <span v-else>{{ scope.row.isReceiveTicket }}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                prop="remarks"
                label="备注"
                :show-overflow-tooltip="isDetail"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!isDetail"
                    v-model="customerBankList[scope.$index].remarks"
                  ></el-input>
                  <span v-else>{{ scope.row.remarks }}</span>
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

    <!-- 查询弹窗 -->
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
          >
            <template slot-scope="scope">
              {{ scope.row.status | statusFilter }}
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

    <!-- 审核弹窗 -->
    <el-dialog
      title="审核"
      label-width="100px"
      :visible.sync="checkDialogVisible"
    >
      <el-form
        ref="checkForm"
        :model="checkInfo"
        :rules="checkRules"
        label-width="100px"
      >
        <el-form-item label="是否同意" prop="isAgree">
          <el-radio-group v-model="checkInfo.isAgree">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="rejectReason">
          <el-input
            v-model="checkInfo.rejectReason"
            placeholder="审核意见"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCheck">确 定</el-button>
      </span>
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
  fetchList,
  fetchListByPage,
  fetchDetail,
  addClient,
  deleteClient,
  approveClient,
} from '@/api/baseInfo/client'

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
      treeLoading: false,
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
      // 审核信息
      checkInfo: {},
      // 查询弹窗是否可见
      queryDialogVisible: false,
      // 审核弹窗是否可见
      checkDialogVisible: false,
      treeProps: {
        children: 'children',
        label: 'customerName',
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
        isTaxpayer: [
          { required: true, message: '请选择是否一般纳税人', trigger: 'blur' },
        ],
        invoiceTitle: [
          { required: true, message: '请输入开票抬头', trigger: 'blur' },
        ],
        socialCreditCode: [
          {
            required: true,
            message: '请输入统一社会信用代码',
            trigger: 'blur',
          },
        ],
        country: [{ required: true, message: '请选择国家', trigger: 'blur' }],
        province: [
          { required: true, message: '请选择省/自治区', trigger: 'blur' },
        ],
        city: [{ required: true, message: '请选择市', trigger: 'blur' }],
        addressPhone: [
          { required: true, message: '请输入地址、电话', trigger: 'blur' },
        ],
        isDisabled: [
          { required: true, message: '请选择是否停用', trigger: 'blur' },
        ],
        adjustReason: [
          { required: true, message: '请输入调整原因', trigger: 'blur' },
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
            <el-select placeholder="状态" vModel={data['status']}>
              {this.statusDict.map(({ value, label }) => (
                <el-option key={value} value={value} label={label}></el-option>
              ))}
            </el-select>
          ),
        },
      ],
      // 校验提示实例
      notify: null,
      checkRules: {
        isAgree: [
          { required: true, message: '请选择是否同意', trigger: 'blur' },
        ],
        rejectReason: [
          { required: true, message: '请输入审核意见', trigger: 'blur' },
        ],
      },
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
    isDetail() {
      return this.type === 'detail'
    },
    isAdjust() {
      return this.type === 'adjust'
    },
    // 调整权限 status 1 初始 2审批中 3审批完成 4已停用
    adjustAuth() {
      return +this.detail.status === 3
    },
    // 审核权限
    checkAuth() {
      return +this.detail.status === 2
    },
    // 删除权限
    deleteAuth() {
      return +this.detail.status === 1
    },
    // 保存权限
    saveAuth() {
      return this.isAdd || +this.detail.status === 1 || this.isAdjust
    },
    // 提交权限
    submitAuth() {
      return this.isAdd || +this.detail.status === 1 || this.isAdjust
    },
    // 是否可操作
    canOperate() {
      return this.isAdd || +this.detail.status === 1 || this.isAdjust
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
            field: 'customerName',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'customerName',
            disabled: !this.canOperate,
            render: (data) => (
              <el-input
                readonly={!this.canOperate}
                vModel={data['customerName']}
              />
            ),
          },
          {
            type: 'label',
            label: '客户编码',
            field: 'customerCode',
            showBg: true,
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
        this.isAdjust
          ? [
              {
                type: 'label',
                label: '是否停用',
                field: 'isDisabled',
                showBg: true,
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
              },
              {
                type: 'empty',
              },
            ]
          : [],
        [
          {
            type: 'label',
            label: '是否关联方',
            field: 'isRelationship',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'isRelationship',
            disabled: !this.canOperate,
            render: (data) => (
              <el-radio-group
                disabled={!this.canOperate}
                vModel={data['isRelationship']}
              >
                <el-radio label={1}>是</el-radio>
                <el-radio label={0}>否</el-radio>
              </el-radio-group>
            ),
          },
          {
            type: 'label',
            label: '是否一般纳税人',
            field: 'isTaxpayer',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'isTaxpayer',
            disabled: !this.canOperate,
            render: (data) => (
              <el-radio-group
                disabled={!this.canOperate}
                vModel={data['isTaxpayer']}
              >
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
            field: 'invoiceTitle',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'invoiceTitle',
            disabled: !this.canOperate,
            render: (data) => (
              <el-input
                readonly={!this.canOperate}
                vModel={data['invoiceTitle']}
              />
            ),
          },
          {
            type: 'label',
            label: '统一社会信用代码',
            field: 'socialCreditCode',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'socialCreditCode',
            disabled: !this.canOperate,
            render: (data) => (
              <el-input
                readonly={!this.canOperate}
                vModel={data['socialCreditCode']}
              />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '国家',
            field: 'country',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'country',
            disabled: !this.canOperate,
            render: (data) => (
              <el-input readonly={!this.canOperate} vModel={data['country']} />
            ),
          },
          {
            type: 'label',
            label: '省/自治区',
            field: 'province',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'province',
            disabled: !this.canOperate,
            render: (data) => (
              <el-input readonly={!this.canOperate} vModel={data['province']} />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '市',
            field: 'city',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'city',
            disabled: !this.canOperate,
            render: (data) => (
              <el-input readonly={!this.canOperate} vModel={data['city']} />
            ),
          },
          {
            type: 'label',
            label: '地址、电话',
            field: 'addressPhone',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'addressPhone',
            disabled: !this.canOperate,
            render: (data) => (
              <el-input
                readonly={!this.canOperate}
                vModel={data['addressPhone']}
              />
            ),
          },
        ],
        ...(this.isAdjust
          ? [
              [
                {
                  type: 'label',
                  label: '调整原因',
                  field: 'adjustReason',
                  showBg: true,
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
                  field: 'adjustExplain',
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
          : []),
      ]
    },
    // 获取左侧树
    async getTreeList() {
      this.treeLoading = true
      const res = await fetchList()
      this.treeLoading = false
      this.treeList = res.data || []
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
      const res = await fetchListByPage(this.listQuery)
      this.list = res && res.data ? res.data : []
      this.total = res ? res.total : 0
      this.listLoading = false
    },
    // 查询弹窗查询
    onSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    // 查询弹窗点击重置数据
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
      this.selectedBank = []
      this.$refs.treeNode.setCurrentKey()
      this.currentKey = null
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
    // 点击左侧树节点
    async onTreeNodeClick(data) {
      this.$refs['gridForm'].$refs['form'].resetFields()
      const id = data[this.rowKey]
      this.currentKey = id
      this.$refs.treeNode.setCurrentKey(id)
      this.$router.replace(`${this.basePath}/list`)
      // 获取详情
      this.fetchDetail({ id })
    },
    // 获取详情
    async fetchDetail(query) {
      const res = await fetchDetail(query)
      this.detail = res && res.data ? res.data : {}
      this.systemData = res && res.data ? res.data : {}
      this.customerBankList =
        res && res.data && res.data.customerBankList
          ? res.data.customerBankList
          : []
      this.selectedBank = []
    },
    // 查询中选中信息
    onSelect(row) {
      this.onTreeNodeClick(row)
      this.queryDialogVisible = false
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
            submitStatus: this.isAdjust ? 3 : 1,
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
            this.$router.replace(`${this.basePath}/list`)
            this.getTreeList()
          }
        }
      })
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
          // submitStatus  --  提交状态  0新增-保存  1新增-提交  2调整-保存  3调整-提交
          const payload = {
            ...this.detail,
            saveType: 1,
            isAdjust: Number(this.isAdjust),
            customerBankList: this.customerBankList.map(
              ({ tempId, ...resValues }) => resValues
            ),
            submitStatus: this.isAdjust ? 2 : 0,
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
            this.$router.replace(`${this.basePath}/list`)
            this.getTreeList()
          }
        }
      })
    },
    // 点击新增
    onClickAdd() {
      this.onResetInfo()
      this.$router.replace(`${this.basePath}/list?type=add`)
    },
    // 点击调整
    onClickAdjust() {
      this.$router.replace({
        path: `${this.basePath}/list`,
        query: { type: 'adjust', id: this.currentKey },
      })
    },
    handleBankChange(val) {
      this.selectedBank = val
    },
    // 新增银行
    addBank() {
      this.customerBankList = [...this.customerBankList, { tempId: Date.now() }]
    },
    deleteBank() {
      if (Array.isArray(this.selectedBank) && this.selectedBank.length) {
        this.customerBankList = this.customerBankList.filter(
          (item) =>
            !this.selectedBank.some(
              (val) => (val.id || val.tempId) === (item.id || item.tempId)
            )
        )
      } else {
        this.$message({
          message: '请先勾选想要删除的数据',
          type: 'warning',
        })
      }
    },
    // 点击银行信息是否主账户
    onIsPrimaryChange(index) {
      this.customerBankList = this.customerBankList.map((item, i) => ({
        ...item,
        isPrimaryAccount: i === index ? 1 : 0,
      }))
    },
    // 点击删除值集
    handleDelete() {
      if (this.currentKey) {
        this.$confirm('是否确定删除该数据？', '提示', { type: 'warning' }).then(
          async () => {
            const res = await deleteClient({ id: this.currentKey })
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
        )
      } else {
        this.$message({
          message: '请选中想要删除的数据',
          type: 'warning',
        })
      }
    },
    // 点击打开审核弹窗
    handleViewCheck() {
      if (!this.currentKey) return
      this.checkDialogVisible = true
    },
    // 提交审核
    handleSubmitCheck() {
      this.$refs['gridForm'].$refs['form'].validate(async (valid, error) => {
        if (!valid) return
        const payload = {
          ...this.checkInfo,
          billId: this.currentKey,
        }
        const res = await approveClient(payload)
        if (res && res.status === 200) {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000,
          })
          this.fetchDetail({ id: this.currentKey })
          this.checkDialogVisible = false
        }
      })
    },
  },
}
</script>
