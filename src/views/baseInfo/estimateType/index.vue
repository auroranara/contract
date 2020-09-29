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
            label="概算编码"
            prop="estimateCode"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="概算名称"
            prop="estimateName"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            label="概算单位"
            prop="estimateUnit"
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
// import { mapState } from 'vuex'
import {
  fetchListByPage,
  fetchList,
  fetchDetail,
  addEstimateType,
  deleteEstimateType,
} from '@/api/baseInfo/estimateType'

export default {
  name: 'estimateType',
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
          field: 'estimateCode',
          alwaysShow: true,
          label: '概算编码',
          render: (data) => (
            <el-input placeholder="概算编码" vModel={data['estimateCode']} />
          ),
        },
        {
          field: 'estimateName',
          alwaysShow: true,
          label: '概算名称',
          render: (data) => (
            <el-input placeholder="概算名称" vModel={data['estimateName']} />
          ),
        },
        {
          field: 'estimateUnit',
          label: '概算单位',
          alwaysShow: true,
          render: (data) => (
            <el-input placeholder="概算单位" vModel={data['estimateUnit']} />
          ),
        },
      ],
      // 基础信息
      detail: {},
      // 系统信息
      systemData: {},
      treeProps: {
        children: 'childEstimateTypeList',
        label: 'estimateName',
        value: 'id',
      },
      // 左侧树
      treeList: [],
      // 弹窗查询列表
      list: [],
      currentKey: null,
      rules: {
        estimateCode: [
          { required: true, message: '请输入概算编码', trigger: 'blur' },
        ],
        estimateName: [
          { required: true, message: '请输入概算名称', trigger: 'blur' },
        ],
        estimateUnit: [
          { required: true, message: '请输入概算单位', trigger: 'blur' },
        ],
        parentId: [
          { required: true, message: '请选择上级节点', trigger: 'blur' },
        ],
      },
      // 当前校验提示实例
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
            field: 'estimateCode',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'estimateCode',
            disabled: this.isDetail,
            colspan: '3',
            render: (data) => (
              <el-input
                readonly={this.isDetail}
                vModel={data['estimateCode']}
              />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '概算名称',
            field: 'estimateName',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'estimateName',
            disabled: this.isDetail,
            colspan: '3',
            render: (data) => (
              <el-input
                readonly={this.isDetail}
                vModel={data['estimateName']}
              />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '概算单位',
            field: 'estimateUnit',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'estimateUnit',
            disabled: this.isDetail,
            colspan: '3',
            render: (data) => (
              <el-input
                readonly={this.isDetail}
                vModel={data['estimateUnit']}
              />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '上级节点',
            field: 'parentId',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'parentId',
            disabled: this.isDetail,
            colspan: '3',
            render: (data) => (
              <tree-select
                style="width:100%"
                disabled={this.isDetail}
                vModel={data['parentId']}
                treeProps={this.treeProps}
                options={this.treeList}
                showFilter
                placeholder=""
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
          estimateName: '概算类型',
          childEstimateTypeList: res && res.data ? res.data : [],
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
    // 点击提交
    onSubmit() {
      this.$refs['gridForm'].$refs['form'].validate(async (valid, err) => {
        this.notify && this.notify.close()
        if (valid) {
          let payload = {
            ...this.detail,
            saveType: 2,
          }
          const res = await addEstimateType(payload)
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
    // 点击删除
    handleDelete() {
      if (this.currentKey) {
        this.$confirm('是否确定删除该数据？', '提示', { type: 'warning' }).then(
          async () => {
            const res = await deleteEstimateType({ id: this.currentKey })
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
