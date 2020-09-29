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
        <el-card class="tree-select-wrapper">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-tree
              ref="treeNode"
              :highlight-current="true"
              :data="treeList"
              :props="treeProps"
              :default-expand-all="true"
              @node-click="onTreeNodeClick"
              :node-key="rowKey"
            ></el-tree>
          </el-scrollbar>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :span="18">
        <el-tabs type="border-card" v-model="tabKey">
          <el-tab-pane name="jcxx" label="值集信息">
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
            <el-button
              v-if="!isDetail"
              size="small"
              type="primary"
              @click="handleAddParams"
              >新增</el-button
            >
            <el-button
              v-if="!isDetail"
              size="small"
              type="danger"
              :disabled="!(selectedParams && selectedParams.length)"
              @click="handleDeleteParams"
              >删除</el-button
            >
            <el-table
              style="margin-top: 10px"
              :data="paramsList"
              border
              @selection-change="handleParamsChange"
            >
              <el-table-column
                v-if="!isDetail"
                type="selection"
                width="55"
                align="center"
              ></el-table-column>
              <el-table-column
                align="center"
                label="序号"
                width="80"
                type="index"
              ></el-table-column>
              <el-table-column
                prop="listName"
                label="名称"
                :show-overflow-tooltip="isDetail"
                align="center"
                label-class-name="required-header"
              >
                <template slot-scope="scope">
                  <el-input
                    v-if="!isDetail"
                    v-model="paramsList[scope.$index].listName"
                  ></el-input>
                  <span v-else>{{ scope.row.listName }}</span>
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
                  <el-input
                    v-if="!isDetail"
                    v-model="paramsList[scope.$index].listCode"
                  ></el-input>
                  <span v-else>{{ scope.row.listCode }}</span>
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
                  <el-select
                    v-if="!isDetail"
                    v-model="paramsList[scope.$index].listStatus"
                  >
                    <el-option
                      v-for="{ value, label } in statusOptions"
                      :key="value"
                      :value="value"
                      :label="label"
                    ></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.listStatus | statusFilter }}</span>
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
import {
  fetchList,
  addValueSet,
  fetchListByPage,
  fetchDetail,
  deleteValueSet,
} from '@/api/baseInfo/valueSet'

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
      rowKey: 'id',
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
            <el-input placeholder="值集编码" vModel={data['code']} />
          ),
        },
        {
          field: 'enableStatus',
          label: '状态',
          alwaysShow: true,
          render: (data) => (
            <el-select placeholder="状态" vModel={data['enableStatus']}>
              {this.statusOptions.map(({ value, label }) => (
                <el-option key={value} value={value} label={label}></el-option>
              ))}
            </el-select>
          ),
        },
      ],
      // 基础信息数据
      detail: {},
      // 系统信息数据
      systemData: {},
      treeProps: {
        children: 'children',
        label: 'name',
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
        enableStatus: [
          { required: true, message: '请选择状态', trigger: 'blur' },
        ],
      },
      // 值集状态
      statusOptions: [
        { value: 1, label: '已启用' },
        { value: 0, label: '已停用' },
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
            field: 'enableStatus',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'enableStatus',
            disabled: this.isDetail,
            render: () => (
              <el-select
                style="width:100%"
                placeholder=""
                vModel={data['enableStatus']}
                disabled={this.isDetail}
              >
                {this.statusOptions.map(({ value, label }) => (
                  <el-option
                    key={value}
                    value={value}
                    label={label}
                  ></el-option>
                ))}
              </el-select>
            ),
          },
        ],
      ]
    },
    // 获取左侧树
    async getTreeList() {
      const res = await fetchList()
      this.treeList = res.data || []
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
    // 查询弹窗查询
    onSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    // 查询弹窗重置
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
    // 点击左侧树
    async onTreeNodeClick(data) {
      this.$refs['gridForm'].$refs['form'].resetFields()
      const id = data[this.rowKey]
      this.currentKey = id
      this.$refs.treeNode.setCurrentKey(id)
      this.$router.replace(`${this.basePath}/list`)
      // 获取详情
      const res = await fetchDetail({ id })
      this.detail = res.data || {}
      this.systemData = res.data || {}
      this.paramsList = res.data && res.data.unitLists ? res.data.unitLists : []
      this.selectedParams = []
    },
    // 查询弹窗选择
    onSelect(row) {
      this.onTreeNodeClick(row)
      this.queryDialogVisible = false
    },
    onResetInfo() {
      this.$refs['gridForm'].$refs['form'].resetFields()
      this.detail = {}
      this.systemData = {}
      this.paramsList = []
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
    // 点击提交
    onSubmit() {
      this.$refs['gridForm'].$refs['form'].validate(async (valid, err) => {
        this.notify && this.notify.close()
        if (!valid) {
          const msg = Object.entries(err)
            .map((item) => item[1].map((val) => val.message).join('，'))
            .join('\n')
          this.notify = this.$notify.error({
            title: '基础信息校验错误',
            message: this.$createElement(
              'div',
              { style: 'white-space:pre-wrap' },
              msg
            ),
            duration: 20000,
          })
        } else {
          let payload = {
            ...this.detail,
            saveType: 2,
            unitLists: this.paramsList.map(
              ({ tempId, ...resValues }) => resValues
            ),
          }
          const res = await addValueSet(payload)
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
    // 点击新增参数列表
    handleAddParams() {
      if (
        this.paramsList &&
        this.paramsList.length &&
        !this.paramsList.every((item) => item.listName && item.listCode)
      ) {
        this.$message({
          message: '请完善参数列表必填项',
          type: 'warning',
        })
        return
      }
      this.paramsList = [
        ...this.paramsList,
        { tempId: Date.now(), listStatus: 1 },
      ]
    },
    // 点击删除勾选的参数列表
    handleDeleteParams() {
      if (Array.isArray(this.selectedParams) && this.selectedParams.length) {
        this.paramsList = this.paramsList.filter(
          (item) =>
            !this.selectedParams.some(
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
    handleParamsChange(val) {
      this.selectedParams = val
    },
    // 点击删除值集
    handleDelete() {
      if (this.currentKey) {
        this.$confirm('是否确定删除该数据？', '提示', { type: 'warning' }).then(
          async () => {
            const res = await deleteValueSet({ id: this.currentKey })
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
<style lang="scss">
.dialog-content {
  min-height: 350px;
}
.required-header > div:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
.tree-select-wrapper {
  .scrollbar-wrapper {
    max-height: 475px;
  }
  .el-card__body {
    padding: 20px 10px;
  }
}
</style>
