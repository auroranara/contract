<template>
  <div class="app-container">
    <div class="head-container">
      <el-button plain type="primary" icon="el-icon-search" @click="onClickSearch">查询</el-button>
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
          <el-tab-pane name="jcxx" label="组织信息">
            <block-title title="基础信息" />
            <grid-form :settings="baseSettings(this.detail)"></grid-form>
          </el-tab-pane>
          <el-tab-pane name="xtxx" label="系统信息">
            <el-row>
              <el-col :md="12" :sm="24">
                <grid-form :settings="systemSettings(this.detail)"></grid-form>
              </el-col>
            </el-row>
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
          <el-table-column align="center" label="组织名称" prop="zzmc" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="组织代码" prop="zzdm" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="公司或组织" prop="gshzz" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="旧机构编码" prop="jjgbm" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="机构级别" prop="jgjb" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column
            align="center"
            label="上级机构编码"
            prop="sjjgbm"
            :show-overflow-tooltip="true"
          ></el-table-column>
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

export default {
  name: 'organization',
  components: {
    ExpandFilter,
    GridForm,
    BlockTitle,
    Pagination,
  },
  data() {
    return {
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
          field: 'zzmc',
          alwaysShow: true,
          label: '组织名称',
          render: (data) => (
            <el-input placeholder="组织名称" vModel={data['zzmc']} />
          ),
        },
      ],
      // 基础信息
      detail: {},
      treeProps: {
        children: 'children',
        label: 'label',
      },
      // 左侧树
      treeList: [],
      // 弹窗查询列表
      list: [],
      currentKey: null,
    }
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
            label: '组织名称',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.zzmc,
          },
          {
            type: 'label',
            label: '组织代码',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.zzdm,
          },
        ],
        [
          {
            type: 'label',
            label: '公司或组织',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.gshzz,
          },
          {
            type: 'label',
            label: '旧机构编码',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.jjgbm,
          },
        ],
        [
          {
            type: 'label',
            label: '机构级别',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.jgjb,
          },
          {
            type: 'label',
            label: '上级机构编码',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.sjjgbm,
          },
        ],
      ]
    },
    systemSettings(data) {
      return [
        [
          {
            type: 'label',
            label: '状态',
            showBg: true,
          },
          {
            type: 'handler',
            render: () => data.zt,
          },
        ],
        [
          {
            type: 'label',
            label: '创建时间',
            showBg: true,
          },
          {
            type: 'handler',
            render: () => data.cjsj,
          },
        ],
        [
          {
            type: 'label',
            label: '创建人',
            showBg: true,
          },
          {
            type: 'handler',
            render: () => data.cjr,
          },
        ],
        [
          {
            type: 'label',
            label: '修改时间',
            showBg: true,
          },
          {
            type: 'handler',
            render: () => data.xgsj,
          },
        ],
        [
          {
            type: 'label',
            label: '修改人',
            showBg: true,
          },
          {
            type: 'handler',
            render: () => data.xgr,
          },
        ],
      ]
    },
    // 获取左侧树
    getTreeList() {
      this.treeList = [
        {
          key: '1',
          label: '组织',
          children: [
            {
              key: '1-1',
              label: '组织1',
            },
            {
              key: '1-2',
              label: '组织2',
            },
            {
              key: '1-3',
              label: '组织3',
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
          label: '组织1',
          zzmc: '无锡轨道交通服务部',
          zzdm: '1',
          gshzz: '公司',
          jjgbm: '1005',
          jgjb: '2',
          sjjgbm: '01',
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
    onClickSearch() {
      this.queryDialogVisible = true
      this.listQuery = {
        page: 1,
        limit: 10,
      }
      this.list = []
    },
    onTreeNodeClick(data) {
      this.currentKey = data.key
      // TODO 点击设置右侧显示参数
      this.detail = {
        key: '1-1',
        label: '组织1',
        zzmc: '无锡轨道交通服务部',
        zzdm: '1',
        gshzz: '公司',
        jjgbm: '1005',
        jgjb: '2',
        sjjgbm: '01',
        zt: '审批完成',
        cjsj: '2019/02/02 18:10',
        cjr: '张三',
        xgsj: '2019/02/02 18:10',
        xgr: '张三',
      }
    },
    onSelect(row) {
      this.currentKey = row.key
      const key = this.$refs.treeNode.setCurrentKey(row.key)
      this.detail = {
        key: '1-1',
        label: '组织1',
        zzmc: '无锡轨道交通服务部',
        zzdm: '1',
        gshzz: '公司',
        jjgbm: '1005',
        jgjb: '2',
        sjjgbm: '01',
        zt: '审批完成',
        cjsj: '2019/02/02 18:10',
        cjr: '张三',
        xgsj: '2019/02/02 18:10',
        xgr: '张三',
      }
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
