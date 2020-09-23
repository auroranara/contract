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
            node-key="key"
          ></el-tree>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :span="18">
        <el-tabs type="border-card" v-model="tabKey">
          <el-tab-pane name="jcxx" label="供应商信息">
            <!-- 基础信息 -->
            <block-title title="基础信息" />
            <grid-form
              ref="gridForm"
              :settings="baseSettings(this.detail)"
              :model="detail"
              :rules="rules"
            ></grid-form>

            <!-- 参数列表 -->
            <block-title title="参数列表" />
            <el-button v-if="!isDetail" size="small" type="primary" @click="handleAddParams">新增</el-button>
            <el-button
              v-if="!isDetail"
              size="small"
              type="danger"
              :disabled="!(selectedParams&&selectedParams.length)"
              @click="handleDeleteParams"
            >删除</el-button>
            <el-table
              style="margin-top:10px"
              :data="paramsList"
              border
              @selection-change="handleParamsChange"
            >
              <el-table-column v-if="!isDetail" type="selection" width="55" align="center"></el-table-column>
              <el-table-column align="center" label="序号" width="80" type="index"></el-table-column>
              <el-table-column
                prop="listName"
                label="名称"
                :show-overflow-tooltip="isDetail"
                align="center"
                label-class-name="required-header"
              >
                <template slot-scope="scope">
                  <el-input v-if="!isDetail" v-model="paramsList[scope.$index].listName"></el-input>
                  <span v-else>{{scope.row.listName}}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="200"
                prop="listCode"
                label="编码"
                :show-overflow-tooltip="isDetail"
                align="center"
                label-class-name="required-header"
              >
                <template slot-scope="scope">
                  <el-input v-if="!isDetail" v-model="paramsList[scope.$index].listCode"></el-input>
                  <span v-else>{{scope.row.listCode}}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="200"
                prop="listStatus"
                label="状态"
                :show-overflow-tooltip="isDetail"
                align="center"
                label-class-name="required-header"
              >
                <template slot-scope="scope">
                  <el-select v-if="!isDetail" v-model="paramsList[scope.$index].listStatus">
                    <el-option
                      v-for="({value,label}) in valueSetStatus"
                      :key="value"
                      :value="value"
                      :label="label"
                    ></el-option>
                  </el-select>
                  <span v-else>{{scope.row.listStatus}}</span>
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
          <el-table-column align="center" label="值集名称" prop="name" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="值集编码" prop="code" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="状态" prop="status" :show-overflow-tooltip="true"></el-table-column>
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
  name: 'valueSet',
  components: {
    ExpandFilter,
    GridForm,
    BlockTitle,
    Pagination,
    SystemInfo,
  },
  data() {
    return {
      basePath: '/baseInfo/valueSet',
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
          field: 'name',
          alwaysShow: true,
          label: '值集名称',
          render: (data) => (
            <el-input placeholder="值集名称" vModel={data['name']} />
          ),
        },
        {
          field: 'code',
          alwaysShow: true,
          label: '值集编码',
          render: (data) => (
            <el-input placeholder="供应商类型" vModel={data['code']} />
          ),
        },
        {
          field: 'status',
          label: '状态',
          alwaysShow: true,
          render: (data) => (
            <el-input placeholder="状态" vModel={data['status']} />
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
      // 参数列表勾选
      selectedParams: [],
      // 参数列表
      paramsList: [],
      rules: {
        name: [{ required: true, message: '请输入值集名称', trigger: 'blur' }],
        enableTime: [
          { required: true, message: '请选择启用时间', trigger: 'blur' },
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
      },
      // 值集状态
      valueSetStatus: [
        { value: 1, label: '已启用' },
        { value: 0, label: '已停用' },
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
            label: '值集名称',
            field: 'name',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'name',
            disabled: this.isDetail,
            render: () => (
              <el-input readonly={this.isDetail} vModel={data['name']} />
            ),
          },
          {
            type: 'label',
            label: '值集编码',
            field: 'code',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'code',
            disabled: true,
            render: () => <el-input readonly vModel={data['code']} />,
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
            label: '启用时间',
            field: 'enableTime',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'enableTime',
            disabled: this.isDetail,
            render: () => (
              <el-date-picker
                readonly={this.isDetail}
                vModel={data['enableTime']}
                type="datetime"
                style="width:100%"
              ></el-date-picker>
            ),
          },
          {
            type: 'label',
            label: '状态',
            field: 'status',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'status',
            disabled: this.isDetail,
            render: () => (
              <el-input readonly={this.isDetail} vModel={data['status']} />
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
          key: '1',
          label: '值集',
          children: [
            {
              key: '1-1',
              label: '值集1',
            },
            {
              key: '1-2',
              label: '值集2',
            },
            {
              key: '1-3',
              label: '值集3',
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
          key: '1-1',
          name: '招标方式',
          code: '0202',
          enableTime: new Date(),
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
      this.currentKey = data.key
      this.$refs.treeNode.setCurrentKey(data.key)
      this.$router.replace(`${this.basePath}/list`)
      // TODO 点击设置右侧显示参数
      this.detail = {
        key: '1-1',
        name: '招标方式招标方式招标方式招标方式招标方式招标方式',
        code: '0202',
        enableTime: new Date(),
        status: 1,
      }
      this.systemData = {
        status: '审批完成',
        createTime: '2019/02/02 18:10',
        createPerson: '张三',
        modifyTime: '2019/02/02 18:10',
        modifyPerson: '张三',
      }
      this.selectedParams = []
    },
    onSelect(row) {
      this.onTreeNodeClick(row)
      this.queryDialogVisible = false
    },
    onResetInfo() {
      this.detail = {}
      this.systemData = {}
      this.selectedParams = []
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
    handleAddParams() {
      this.paramsList = [...this.paramsList, { id: Date.now() }]
    },
    handleDeleteParams() {
      if (Array.isArray(this.selectedParams) && this.selectedParams.length) {
        this.paramsList = this.paramsList.filter(
          (item) => !this.selectedParams.some((val) => val.id === item.id)
        )
      } else {
        this.$message({
          message: '请先勾选想要删除的数据',
          type: 'warning',
        })
      }
    },
    handleParamsChange(val) {
      this.selectedParams = val
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