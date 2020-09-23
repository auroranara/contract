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
          <el-tab-pane name="jcxx" label="概算类型信息">
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
          <el-table-column width="80" align="center" label="序号" type="index"></el-table-column>
          <el-table-column align="center" label="概算编码" prop="gsbm" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="概算名称" prop="gsmc" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="概算单位" prop="gsdw" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column width="100" fixed="right" align="center" label="操作">
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
  name: 'bidStage',
  components: {
    ExpandFilter,
    GridForm,
    BlockTitle,
    Pagination,
    SystemInfo,
  },
  data() {
    return {
      basePath: '/baseInfo/estimateType',
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
      // 查询弹窗是否可见
      queryDialogVisible: false,
      fields: [
        {
          field: 'gsbm',
          alwaysShow: true,
          label: '概算编码',
          render: (data) => (
            <el-input placeholder="概算编码" vModel={data['gsbm']} />
          ),
        },
        {
          field: 'gsmc',
          alwaysShow: true,
          label: '概算名称',
          render: (data) => (
            <el-input placeholder="概算名称" vModel={data['gsmc']} />
          ),
        },
        {
          field: 'gsdw',
          label: '概算单位',
          alwaysShow: true,
          render: (data) => (
            <el-input placeholder="概算单位" vModel={data['gsdw']} />
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
      rules: {
        gsbm: [{ required: true, message: '请输入概算编码', trigger: 'blur' }],
        gsmc: [{ required: true, message: '请输入概算名称', trigger: 'blur' }],
        gsdw: [{ required: true, message: '请输入概算单位', trigger: 'blur' }],
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
            label: '概算编码',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'gsbm',
            disabled: this.isDetail,
            colspan: '3',
            render: (data) => (
              <el-input readonly={this.isDetail} vModel={data['gsbm']} />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '概算名称',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'gsmc',
            disabled: this.isDetail,
            colspan: '3',
            render: (data) => (
              <el-input readonly={this.isDetail} vModel={data['gsmc']} />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '概算单位',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'gsdw',
            disabled: this.isDetail,
            colspan: '3',
            render: (data) => (
              <el-input readonly={this.isDetail} vModel={data['gsdw']} />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '上级节点',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'sjjd',
            disabled: this.isDetail,
            colspan: '3',
            render: (data) => (
              <el-input readonly={this.isDetail} vModel={data['sjjd']} />
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
          label: '概算',
          children: [
            {
              id: '1-1',
              label: '概算1',
            },
            {
              id: '1-2',
              label: '概算2',
            },
            {
              id: '1-3',
              label: '概算3',
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
          gsbm: 'G',
          gsmc: '工程费用',
          gsdw: 'm2',
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
        gsbm: 'G',
        gsmc: '工程费用',
        gsdw: 'm2',
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
    onSave() {
      // this.$refs['gridForm'].$refs['form'].validate((valid, err) => {
      //   if (err) {
      //     const msg = Object.entries(err)
      //       .map((item) => item[1].map((val) => val.message).join('，'))
      //       .join('\n')
      //     this.$notify.error({
      //       title: '校验错误信息',
      //       message: this.$createElement(
      //         'div',
      //         { style: 'white-space:pre-wrap' },
      //         msg
      //       ),
      //       duration: 20000,
      //     })
      //   } else {
      //     console.log('form', this.detail)
      //   }
      // })
    },
    onResetInfo() {
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
