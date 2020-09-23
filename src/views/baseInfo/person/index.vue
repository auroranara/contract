<template>
  <div class="app-container">
    <div class="head-container">
      <el-button plain type="primary" icon="el-icon-search" @click="handleViewSearch">查询</el-button>
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
          <el-tab-pane name="jcxx" label="人员信息">
            <block-title title="基础信息" />
            <grid-form :settings="baseSettings(this.detail)"></grid-form>
          </el-tab-pane>
          <el-tab-pane name="xtxx" label="系统信息">
            <system-info :data="systemData" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

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
          <el-table-column align="center" label="序号" width="80" type="index"></el-table-column>
          <el-table-column align="center" label="人员名称" prop="rymc" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="人员代码" prop="rydm" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="职位" prop="zw" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="用户性质" prop="yhxz" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="角色" prop="js" :show-overflow-tooltip="true"></el-table-column>
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

export default {
  name: 'person',
  components: {
    ExpandFilter,
    GridForm,
    BlockTitle,
    Pagination,
    SystemInfo,
  },
  data() {
    return {
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
          field: 'rymc',
          alwaysShow: true,
          label: '人员名称',
          render: (data) => (
            <el-input placeholder="人员名称" vModel={data['rymc']} />
          ),
        },
        {
          field: 'rydm',
          alwaysShow: true,
          label: '人员代码',
          render: (data) => (
            <el-input placeholder="人员代码" vModel={data['rydm']} />
          ),
        },
        {
          field: 'zw',
          label: '职位',
          render: (data) => <el-input placeholder="职位" vModel={data['zw']} />,
        },
        {
          field: 'ssbm',
          label: '所属部门',
          render: (data) => (
            <el-input placeholder="所属部门" vModel={data['ssbm']} />
          ),
        },
        {
          field: 'js',
          label: '角色',
          render: (data) => <el-input placeholder="角色" vModel={data['js']} />,
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
            label: '照片',
            showBg: true,
            colStyle: {
              width: '230px',
            },
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.zp,
          },
          {
            type: 'label',
            label: '虚拟岗位',
            showBg: true,
            colStyle: {
              width: '160px',
            },
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.xngw,
          },
        ],
        [
          {
            type: 'label',
            label: '人员名称',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.rymc,
          },
          {
            type: 'label',
            label: '人员代码',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.rydm,
          },
        ],
        [
          {
            type: 'label',
            label: '职位',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.zw,
          },
          {
            type: 'label',
            label: '用户性质',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.yhxz,
          },
        ],
        [
          {
            type: 'label',
            label: '所属部门',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.ssbm,
          },
          {
            type: 'label',
            label: '角色',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.js,
          },
        ],
        [
          {
            type: 'label',
            label: '是否可以看到所有合同信息',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => this.generateJudge(data.sfkykdsyhtxx),
          },
          {
            type: 'label',
            label: '所有标段审批可选',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => this.generateJudge(data.syspbdkx),
          },
        ],
        [
          {
            type: 'label',
            label: '电话',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.dh,
          },
          {
            type: 'label',
            label: '邮箱',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.yx,
          },
        ],
      ]
    },
    // 获取左侧树
    getTreeList() {
      this.treeList = [
        {
          id: '1',
          label: '人员',
          children: [
            {
              id: '1-1',
              label: '人员1',
            },
            {
              id: '1-2',
              label: '人员2',
            },
            {
              id: '1-3',
              label: '人员3',
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
          rymc: '徐峥',
          rydm: '0001',
          zw: '董事局主席',
          yhxz: '公司职员',
          ssbm: '主任室',
          js: 'ADMIN系统管理员',
          dh: '13810504433',
          yx: '123@163.com',
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
    generateJudge(value) {
      return (
        (['1', 1].includes(value) && '是') ||
        (['0', 0].includes(value) && '否') ||
        ''
      )
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
      // TODO 点击设置右侧显示参数
      this.detail = {
        id: '1-1',
        rymc: '徐峥',
        rydm: '0001',
        zw: '董事局主席',
        yhxz: '公司职员',
        ssbm: '主任室',
        js: 'ADMIN系统管理员',
        sfkykdsyhtxx: 1,
        syspbdkx: 1,
        dh: '13810504433',
        yx: '123@163.com',
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
<style lang="scss" scoped>
.dialog-content {
  min-height: 350px;
}
</style>
