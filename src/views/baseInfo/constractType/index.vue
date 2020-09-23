<template>
  <div class="app-container">
    <div class="head-container">
      <el-button plain type="primary" icon="el-icon-search" @click="handleViewSearch">查询</el-button>
      <el-button plain type="primary" @click="onClickAdd">新增</el-button>
      <el-button plain type="primary" @click="onSave">保存</el-button>
      <el-button plain type="primary">提交</el-button>
      <el-button plain type="primary" @click="onClickAdjust">调整</el-button>
      <el-button plain type="primary">审核</el-button>
      <el-button plain type="primary">删除</el-button>
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
        <expand-Filter :fields="fields" :model="listQuery" type="inline" :showLabel="false">
          <template v-slot:operations>
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
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
          <el-table-column width="80" align="center" label="序号" type="index"></el-table-column>
          <el-table-column align="center" label="分类名称" prop="flmc" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="上级节点" prop="sjjd" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="收支类型" prop="szlx" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="清单类型" prop="qdlx" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="会计属性" prop="kjsx" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column
            align="center"
            label="期中支付类型"
            prop="qzzflx"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column align="center" label="合同编码" prop="htbm" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button @click="onSelect(scope.row)" type="text">选择</el-button>
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
  name: 'constractType',
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
          field: 'flmc',
          alwaysShow: true,
          label: '分类名称',
          render: (data) => (
            <el-input placeholder="分类名称" vModel={data['flmc']} />
          ),
        },
        {
          field: 'sjjd',
          alwaysShow: true,
          label: '上级节点',
          render: (data) => (
            <el-input placeholder="上级节点" vModel={data['sjjd']} />
          ),
        },
        {
          field: 'szlx',
          label: '收支类型',
          alwaysShow: true,
          render: (data) => (
            <el-select placeholder="收支类型" vModel={data['szlx']}>
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
          field: 'qdlx',
          label: '清单类型',
          render: (data) => (
            <el-select placeholder="清单类型" vModel={data['qdlx']}>
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
          field: 'kjsx',
          label: '会计属性',
          render: (data) => (
            <el-select placeholder="会计属性" vModel={data['kjsx']}>
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
          field: 'qzzflx',
          label: '期中支付类型',
          render: (data) => (
            <el-select placeholder="期中支付类型" vModel={data['qzzflx']}>
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
          field: 'htbm',
          label: '合同编码',
          render: (data) => (
            <el-input placeholder="合同编码" vModel={data['htbm']} />
          ),
        },
      ],
      // 基础信息数据
      detail: {},
      // 系统信息数据
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
      // 参数列表
      paramsList: [],
      rules: {
        flmc: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        sjjd: [{ required: true, message: '请输入上级节点', trigger: 'blur' }],
        szlx: [{ required: true, message: '请选择收支类型', trigger: 'blur' }],
        qdlx: [{ required: true, message: '请选择清单类型', trigger: 'blur' }],
        htbm: [{ required: true, message: '请输入合同编码', trigger: 'blur' }],
        kjsx: [{ required: true, message: '请选择会计属性', trigger: 'blur' }],
        qzzflx: [
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
        { value: '1', label: '收款类型' },
        { value: '2', label: '付款类型' },
      ],
      // 清单类型选项
      listTypes: [
        { value: '1', label: '概算' },
        { value: '2', label: '预算' },
        { value: '3', label: '收款计划' },
      ],
      // 会计属性选项
      accountingAttributes: [
        { value: '1', label: '经营' },
        { value: '2', label: '建设类型' },
      ],
      // 期中支付类型
      interimPayment: [
        { value: '1', label: '采购' },
        { value: '2', label: '建设' },
        { value: '3', label: '其他' },
      ],
    }
  },
  computed: {
    // ...mapState({
    //   statusDict: (state) => state.baseInfo.statusDict,
    // }),
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
            field: 'flmc',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'flmc',
            disabled: this.isDetail,
            render: () => (
              <el-input readonly={this.isDetail} vModel={data['flmc']} />
            ),
          },
          {
            type: 'label',
            label: '分类编码',
            field: 'flbm',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'flbm',
            disabled: true,
            render: () => <el-input readonly vModel={data['flbm']} />,
          },
        ],
        this.isAdjust
          ? [
              {
                type: 'label',
                label: '是否停用',
                showBg: true,
                required: true,
              },
              {
                type: 'handler',
                field: 'enableStatus',
                render: (data) => (
                  <el-radio-group vModel={data['enableStatus']}>
                    <el-radio label={0}>是</el-radio>
                    <el-radio label={1}>否</el-radio>
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
            label: '上级节点',
            field: 'sjjd',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'sjjd',
            disabled: this.isDetail,
            render: () => (
              <el-input readonly={this.isDetail} vModel={data['sjjd']} />
            ),
          },
          {
            type: 'label',
            label: '层级',
            field: 'cj',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'cj',
            disabled: true,
            render: () => <el-input readonly vModel={data['cj']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '收支类型',
            field: 'szlx',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'szlx',
            disabled: this.isDetail,
            render: () => (
              <el-select
                placeholder=""
                vModel={data['szlx']}
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
            field: 'qdlx',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'qdlx',
            disabled: this.isDetail,
            render: () => (
              <el-select
                placeholder=""
                vModel={data['qdlx']}
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
            field: 'htbm',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'htbm',
            disabled: this.isDetail,
            render: () => (
              <el-input readonly={this.isDetail} vModel={data['htbm']} />
            ),
          },
          {
            type: 'label',
            label: '会计属性',
            field: 'kjsx',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'kjsx',
            disabled: this.isDetail,
            render: () => (
              <el-select
                placeholder=""
                vModel={data['kjsx']}
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
            field: 'qzzflx',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'qzzflx',
            disabled: this.isDetail,
            colspan: '3',
            render: () => (
              <el-select
                placeholder=""
                vModel={data['qzzflx']}
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
            field: 'bz',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'bz',
            disabled: this.isDetail,
            colspan: '3',
            render: () => (
              <el-input
                readonly={this.isDetail}
                type="textarea"
                vModel={data['bz']}
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
          : []),
      ]
    },
    // 获取左侧树
    getTreeList() {
      this.treeList = [
        {
          id: '1',
          label: '分类',
          children: [
            {
              id: '1-1',
              label: '分类1',
            },
            {
              id: '1-2',
              label: '分类2',
            },
            {
              id: '1-3',
              label: '分类3',
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
          flmc: '土建',
          flbm: '0123',
          jsjd: '施工合同',
          cj: '3',
          szlx: '1',
          qdlx: '1',
          htbm: '01',
          kjsx: '1',
          qzzflx: '1',
          bz: '',
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
      this.$router.replace(`${this.basePath}/list`)
      // TODO 点击设置右侧显示参数
      this.detail = {
        id: '1-1',
        flmc: '土建',
        flbm: '0123',
        jsjd: '施工合同',
        cj: '3',
        szlx: '1',
        qdlx: '1',
        htbm: '01',
        kjsx: '1',
        qzzflx: '1',
        bz: '',
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
      this.onTreeNodeClick(row)
      this.queryDialogVisible = false
    },
    onResetInfo() {
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
    onSave() {
      this.$refs['gridForm'].$refs['form'].validate((valid, err) => {
        if (err) {
          const msg = Object.entries(err)
            .map((item) => item[1].map((val) => val.message).join('，'))
            .join('\n')
          this.$notify.error({
            title: '校验错误信息',
            message: this.$createElement(
              'div',
              { style: 'white-space:pre-wrap' },
              msg
            ),
            duration: 20000,
          })
        } else {
          console.log('form', this.detail)
        }
      })
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
