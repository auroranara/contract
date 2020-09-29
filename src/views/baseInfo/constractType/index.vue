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
      <el-button
        :disabled="!(isDetail && currentKey)"
        plain
        type="primary"
        @click="onClickAdjust"
        >调整</el-button
      >
      <el-button :disabled="isDetail" plain type="primary" @click="onSubmit"
        >提交</el-button
      >
      <el-button
        :disabled="!isDetail || !currentKey"
        @click="handleDelete"
        plain
        type="primary"
        >删除</el-button
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
            @node-click="onTreeNodeClick"
            :node-key="rowKey"
            :expand-on-click-node="false"
          ></el-tree>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :span="18">
        <el-tabs type="border-card" v-model="tabKey">
          <el-tab-pane name="jcxx" label="合同分类信息">
            <!-- 基础信息 -->
            <block-title title="基础信息" />
            <grid-form
              ref="gridForm"
              :settings="baseSettings(this.detail)"
              :model="detail"
              :rules="rules"
            ></grid-form>
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
            align="center"
            label="分类名称"
            prop="classifyName"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="上级节点"
            prop="parentNodeName"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="收支类型"
            prop="inOutStatus"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="清单类型"
            prop="listStatus"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="会计属性"
            prop="accountAttributes"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="期中支付类型"
            prop="paymentType"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="合同编码"
            prop="contractCode"
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
import TreeSelect from '@/components/TreeSelect'
import { mapState } from 'vuex'
import {
  fetchListByPage,
  fetchList,
  fetchDetail,
  addConstractType,
  deleteConstractType,
} from '@/api/baseInfo/constractType'

export default {
  name: 'constractType',
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
      rowKey: 'id',
      basePath: '/baseInfo/constractType',
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
      // 查询弹窗筛选配置
      fields: [
        {
          field: 'classifyName',
          alwaysShow: true,
          label: '分类名称',
          render: (data) => (
            <el-input placeholder="分类名称" vModel={data['classifyName']} />
          ),
        },
        {
          field: 'parentNode',
          alwaysShow: true,
          label: '上级节点',
          render: (data) => (
            <tree-select
              style="width:100%"
              vModel={data['parentNode']}
              treeProps={this.treeProps}
              options={this.treeList}
              placeholder="上级节点"
            />
          ),
        },
        {
          field: 'inOutStatus',
          label: '收支类型',
          alwaysShow: true,
          render: (data) => (
            <el-select placeholder="收支类型" vModel={data['inOutStatus']}>
              {this.paymentsTypes.map((item) => (
                <el-option
                  key={item.value}
                  value={item.value}
                  label={item.label}
                ></el-option>
              ))}
            </el-select>
          ),
        },
        {
          field: 'listStatus',
          label: '清单类型',
          render: (data) => (
            <el-select placeholder="清单类型" vModel={data['listStatus']}>
              {this.listTypes.map((item) => (
                <el-option
                  key={item.value}
                  value={item.value}
                  label={item.label}
                ></el-option>
              ))}
            </el-select>
          ),
        },
        {
          field: 'accountAttributes',
          label: '会计属性',
          render: (data) => (
            <el-select
              placeholder="会计属性"
              vModel={data['accountAttributes']}
            >
              {this.accountingAttributes.map((item) => (
                <el-option
                  key={item.value}
                  value={item.value}
                  label={item.label}
                ></el-option>
              ))}
            </el-select>
          ),
        },
        {
          field: 'paymentType',
          label: '期中支付类型',
          render: (data) => (
            <el-select placeholder="期中支付类型" vModel={data['paymentType']}>
              {this.interimPayment.map((item) => (
                <el-option
                  key={item.value}
                  value={item.value}
                  label={item.label}
                ></el-option>
              ))}
            </el-select>
          ),
        },
        {
          field: 'contractCode',
          label: '合同编码',
          render: (data) => (
            <el-input placeholder="合同编码" vModel={data['contractCode']} />
          ),
        },
      ],
      // 基础信息数据
      detail: {},
      // 系统信息数据
      systemData: {},
      treeProps: {
        children: 'childrenCategoryList',
        label: 'classifyName',
        value: 'id',
      },
      // 左侧树
      treeList: [],
      // 弹窗查询列表
      list: [],
      currentKey: null,
      // 参数列表
      paramsList: [],
      rules: {
        classifyName: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
        parentNode: [
          { required: true, message: '请输入上级节点', trigger: 'blur' },
        ],
        inOutStatus: [
          { required: true, message: '请选择收支类型', trigger: 'blur' },
        ],
        listStatus: [
          { required: true, message: '请选择清单类型', trigger: 'blur' },
        ],
        contractCode: [
          { required: true, message: '请输入合同编码', trigger: 'blur' },
        ],
        accountAttributes: [
          { required: true, message: '请选择会计属性', trigger: 'blur' },
        ],
        paymentType: [
          { required: true, message: '请选择期中支付类型', trigger: 'blur' },
        ],
      },
      // 值集状态
      valueSetStatus: [
        { value: 1, label: '已启用' },
        { value: 0, label: '已停用' },
      ],
      // 收支类型选项
      paymentsTypes: [
        { value: 1, label: '收款类型' },
        { value: 2, label: '付款类型' },
      ],
      // 清单类型选项
      listTypes: [
        { value: 1, label: '概算' },
        { value: 2, label: '预算' },
        { value: 3, label: '收款计划' },
      ],
      // 会计属性选项
      accountingAttributes: [
        { value: 1, label: '经营' },
        { value: 2, label: '建设类型' },
      ],
      // 期中支付类型
      interimPayment: [
        { value: 1, label: '采购' },
        { value: 2, label: '建设' },
        { value: 3, label: '其他' },
      ],
      // 校验提示实例
      notify: null,
    }
  },
  computed: {
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
  },
  filters: {
    // 状态
    valueSetStatusFilter(value) {
      const target = this.valueSetStatus.find((item) => item.value === value)
      return target ? target.label : ''
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
            label: '分类名称',
            field: 'classifyName',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'classifyName',
            disabled: this.isDetail,
            render: () => (
              <el-input
                readonly={this.isDetail}
                vModel={data['classifyName']}
              />
            ),
          },
          {
            type: 'label',
            label: '分类编码',
            field: 'classifyCode',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'classifyCode',
            disabled: true,
            render: () => <el-input readonly vModel={data['classifyCode']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '上级节点',
            field: 'parentNode',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'parentNode',
            disabled: this.isDetail,
            render: () => (
              <tree-select
                style="width:100%"
                disabled={this.isDetail}
                vModel={data['parentNode']}
                treeProps={this.treeProps}
                options={this.treeList}
                placeholder=""
                showFilter
                onChange={this.onTreeSelectChange}
              />
            ),
          },
          {
            type: 'label',
            label: '层级',
            field: 'hierarchy',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'hierarchy',
            disabled: true,
            render: () => <el-input readonly vModel={data['hierarchy']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '收支类型',
            field: 'inOutStatus',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'inOutStatus',
            disabled: this.isDetail,
            render: () => (
              <el-select
                placeholder=""
                vModel={data['inOutStatus']}
                style="width:100%"
                disabled={this.isDetail}
              >
                {this.paymentsTypes.map((item) => (
                  <el-option
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  ></el-option>
                ))}
              </el-select>
            ),
          },
          {
            type: 'label',
            label: '清单类型',
            field: 'listStatus',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'listStatus',
            disabled: this.isDetail,
            render: () => (
              <el-select
                placeholder=""
                vModel={data['listStatus']}
                style="width:100%"
                disabled={this.isDetail}
              >
                {this.listTypes.map((item) => (
                  <el-option
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  ></el-option>
                ))}
              </el-select>
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '合同编码',
            field: 'contractCode',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'contractCode',
            disabled: this.isDetail,
            render: () => (
              <el-input
                readonly={this.isDetail}
                vModel={data['contractCode']}
              />
            ),
          },
          {
            type: 'label',
            label: '会计属性',
            field: 'accountAttributes',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'accountAttributes',
            disabled: this.isDetail,
            render: () => (
              <el-select
                placeholder=""
                vModel={data['accountAttributes']}
                style="width:100%"
                disabled={this.isDetail}
              >
                {this.accountingAttributes.map((item) => (
                  <el-option
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  ></el-option>
                ))}
              </el-select>
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '期中支付类型',
            field: 'paymentType',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'paymentType',
            disabled: this.isDetail,
            colspan: '3',
            render: () => (
              <el-select
                placeholder=""
                vModel={data['paymentType']}
                style="width:100%"
                disabled={this.isDetail}
              >
                {this.interimPayment.map((item) => (
                  <el-option
                    key={item.value}
                    value={item.value}
                    label={item.label}
                  ></el-option>
                ))}
              </el-select>
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '备注',
            field: 'remarks',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'remarks',
            disabled: this.isDetail,
            colspan: '3',
            render: () => (
              <el-input
                readonly={this.isDetail}
                type="textarea"
                vModel={data['remarks']}
              />
            ),
          },
        ],
      ]
    },
    // 获取左侧树
    async getTreeList() {
      const res = await fetchList()
      this.treeList = [
        {
          id: '-1',
          classifyName: '合同分类',
          childrenCategoryList: res && res.data ? res.data : [],
          hierarchy: 0,
        },
      ]
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
    async onTreeNodeClick(data) {
      if (+data.id === -1) return
      this.$refs['gridForm'].$refs['form'].resetFields()
      const id = data[this.rowKey]
      this.currentKey = id
      this.$refs.treeNode.setCurrentKey(id)
      this.$router.replace(`${this.basePath}/list`)
      // 获取详情
      const res = await fetchDetail({ id })
      this.detail = res.data || {}
      this.systemData = res.data || {}
    },
    onSelect(row) {
      this.onTreeNodeClick(row)
      this.queryDialogVisible = false
    },
    onResetInfo() {
      this.$refs['gridForm'].$refs['form'].resetFields()
      this.detail = {}
      this.systemData = {}
      this.$refs.treeNode.setCurrentKey()
      this.currentKey = null
    },
    // 点击新增
    onClickAdd() {
      this.onResetInfo()
      this.$router.replace(`${this.basePath}/list?type=add`)
    },
    // 点击调整
    onClickAdjust() {
      // TODO：重修获取数据
      this.$refs.treeNode.setCurrentKey()
      this.currentKey = null
      this.$router.replace(`${this.basePath}/list?type=adjust`)
    },
    // 点击提交
    onSubmit() {
      this.$refs['gridForm'].$refs['form'].validate(async (valid, err) => {
        this.notify && this.notify.close()
        if (valid) {
          let payload = {
            ...this.detail,
            saveType: 2,
          }
          const res = await addConstractType(payload)
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
        } else {
          const msg = Object.entries(err)
            .map((item) => item[1].map((val) => val.message).join('，'))
            .join('\n')
          this.notify = this.$notify.error({
            title: '校验错误信息',
            message: this.$createElement(
              'div',
              { style: 'white-space:pre-wrap' },
              msg
            ),
            duration: 20000,
          })
        }
      })
    },
    // 点击删除
    handleDelete() {
      if (this.currentKey) {
        this.$confirm('是否确定删除该数据？', '提示', { type: 'warning' }).then(
          async () => {
            const res = await deleteConstractType({ id: this.currentKey })
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
    // 上级节点改变，同步层级的数据
    onTreeSelectChange(value, node) {
      this.detail = {
        ...this.detail,
        hierarchy: node ? +node.hierarchy + 1 : null,
      }
    },
  },
}
</script>
<style lang="scss">
.dialog-content {
  min-height: 350px;
}
.required-header > div:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
</style>
