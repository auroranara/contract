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
      <!-- <el-button plain type="primary">审核</el-button> -->
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
            ></grid-form>

            <!-- 参数列表 -->
            <block-title title="参数列表" />
            <el-table style="margin-top: 10px" :data="paramsList" border>
              <el-table-column
                align="center"
                label="序号"
                width="80"
                type="index"
              ></el-table-column>
              <el-table-column
                prop="listName"
                label="名称"
                :show-overflow-tooltip="true"
                align="center"
              ></el-table-column>
              <el-table-column
                width="200"
                prop="listCode"
                label="编码"
                :show-overflow-tooltip="true"
                align="center"
              ></el-table-column>
              <el-table-column
                width="200"
                prop="listStatus"
                label="状态"
                :show-overflow-tooltip="true"
                align="center"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.listStatus | statusFilter }}</span>
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
            label="值集名称"
            prop="name"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="值集编码"
            prop="code"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="状态"
            prop="enableStatus"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.enableStatus | statusFilter }}
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
import { mapState } from 'vuex'
import { judgeFilter } from '@/utils/filters'
// import {

// } from '@/api/baseInfo/valueSet'

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
          field: 'enableStatus',
          label: '状态',
          alwaysShow: true,
          render: (data) => (
            <el-input placeholder="状态" vModel={data['enableStatus']} />
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
  },
  filters: {
    // 状态
    statusFilter(value) {
      return (value === 1 && '已启用') || (value === 0 && '已停用') || ''
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
            disabled: true,
            render: () => <el-input readonly vModel={data['name']} />,
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
        [
          {
            type: 'label',
            label: '是否停用',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'isDisabled',
            disabled: true,
            render: (data) => judgeFilter(data.isDisabled),
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
            label: '启用时间',
            field: 'enableTime',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'enableTime',
            disabled: true,
            render: () => (
              <el-date-picker
                readonly
                vModel={data['enableTime']}
                type="datetime"
                style="width:100%"
              ></el-date-picker>
            ),
          },
          {
            type: 'label',
            label: '状态',
            field: 'enableStatus',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'enableStatus',
            disabled: true,
            render: () => <el-input readonly vModel={data['enableStatus']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '调整原因',
            showBg: true,
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
    },
    onSelect(row) {
      this.onTreeNodeClick(row)
      this.queryDialogVisible = false
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
