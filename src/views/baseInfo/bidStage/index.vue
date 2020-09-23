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
          <el-tab-pane name="jcxx" label="标段信息">
            <block-title title="基础信息" />
            <grid-form :settings="baseSettings(this.detail)"></grid-form>

            <block-title title="单项工程" class="mt15" />
            <el-table :data="singleProjectList" border>
              <el-table-column
                align="center"
                label="单项工程名称"
                prop="dxgcmc"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                align="center"
                label="子单位工程名称"
                prop="zdwgcmc"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column align="center" label="备注" prop="bz" :show-overflow-tooltip="true"></el-table-column>
            </el-table>

            <block-title title="子单位工程" class="mt15" />
            <el-table :data="subUnitProjctList" border>
              <el-table-column
                align="center"
                label="单项工程名称"
                prop="dxgcmc"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                align="center"
                label="子单位工程名称"
                prop="zdwgcmc"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column align="center" label="规费" prop="gf" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column align="center" label="备注" prop="bz" :show-overflow-tooltip="true"></el-table-column>
            </el-table>

            <block-title title="规费" class="mt15" />
            <el-table :data="feesList" border>
              <el-table-column
                align="center"
                label="子单位工程名称"
                prop="zdwgcmc"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column align="center" label="规费" prop="gf" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column align="center" label="备注" prop="bz" :show-overflow-tooltip="true"></el-table-column>
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
          <el-table-column
            width="100"
            align="center"
            label="标段名称"
            prop="bdmc"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="合同分类"
            prop="htfl"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="线路"
            prop="xl"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="150"
            align="center"
            label="是否材料标段"
            prop="sfclbd"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="建设单位"
            prop="jsdw"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="主管部门"
            prop="zgbm"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="施工单位"
            prop="sgdw"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="监理单位"
            prop="jldw"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="150"
            align="center"
            label="计量支付比率"
            prop="jlzfbl"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            width="100"
            align="center"
            label="状态"
            prop="zt"
            :show-overflow-tooltip="true"
          ></el-table-column>
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
          field: 'bdmc',
          alwaysShow: true,
          label: '标段名称',
          render: (data) => (
            <el-input placeholder="标段名称" vModel={data['bdmc']} />
          ),
        },
        {
          field: 'htfl',
          alwaysShow: true,
          label: '合同分类',
          render: (data) => (
            <el-input placeholder="合同分类" vModel={data['htfl']} />
          ),
        },
        {
          field: 'xl',
          label: '线路',
          render: (data) => <el-input placeholder="线路" vModel={data['xl']} />,
        },
        {
          field: 'status',
          label: '状态',
          render: (data) => (
            <el-select placeholder="状态" vModel={data['status']}>
              {this.statusDict.map(({ value, label }) => (
                <el-option key={value} value={value} label={label}></el-option>
              ))}
            </el-select>
          ),
        },
      ],
      // 基础信息
      detail: {},
      // 系统信息
      systemData: {},
      // 单项工程列表
      singleProjectList: [],
      // 子单位工程列表
      subUnitProjctList: [],
      // 规费列表
      feesList: [],
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
  computed: {
    ...mapState({
      statusDict: (state) => state.baseInfo.statusDict,
    }),
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
            label: '标段名称',
            showBg: true,
            tdStyle: {
              width: '150px',
            },
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.bdmc,
          },
          {
            type: 'label',
            label: '标段编码',
            showBg: true,
            tdStyle: {
              width: '180px',
            },
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.dmbm,
          },
        ],
        [
          {
            type: 'label',
            label: '合同编号',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.htbh,
          },
          {
            type: 'label',
            label: '合同分类',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.htfl,
          },
        ],
        [
          {
            type: 'label',
            label: '线路',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.xl,
          },
          {
            type: 'label',
            label: '是否材料标段',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => this.generateJudge(data.sfclbd),
          },
        ],
        [
          {
            type: 'label',
            label: '建设单位',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.jsdw,
          },
          {
            type: 'label',
            label: '建设单位负责人',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.jsdwfzr,
          },
        ],
        [
          {
            type: 'label',
            label: '主管部门',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.zgbm,
          },
          {
            type: 'label',
            label: '项目负责人',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.xmfzr,
          },
        ],
        [
          {
            type: 'label',
            label: '施工单位',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.sgdw,
          },
          {
            type: 'label',
            label: '施工单位负责人',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.sgdwfzr,
          },
        ],
        [
          {
            type: 'label',
            label: '监理单位',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.jldw,
          },
          {
            type: 'label',
            label: '监理单位负责人',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.jldwfzr,
          },
        ],
        [
          {
            type: 'label',
            label: '预算工程师',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.ysgcs,
          },
          {
            type: 'empty',
            disabled: true,
            colspan: '2',
          },
        ],
        [
          {
            type: 'label',
            label: '概算总额（万元）',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.gsze,
          },
          {
            type: 'label',
            label: '计量支付比率',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.jlzfbl,
          },
        ],
        [
          {
            type: 'label',
            label: '开工日期',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.kgrq,
          },
          {
            type: 'label',
            label: '竣工日期',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.jgrq,
          },
        ],
        [
          {
            type: 'label',
            label: '备注',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.bz,
            colspan: '3',
          },
        ],
      ]
    },
    // 获取左侧树
    getTreeList() {
      this.treeList = [
        {
          id: '1',
          label: '标段',
          children: [
            {
              id: '1-1',
              label: '标段1',
            },
            {
              id: '1-2',
              label: '标段2',
            },
            {
              id: '1-3',
              label: '标段3',
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
          bdmc: '无锡地铁4号线一期工程机电、装修安装工程',
          bdbm: '400123',
          htbh: 'DSADFFAS',
          htfl: '工程类',
          xl: '4号线',
          sfclbd: 0,
          jsdw: '无锡地铁集团有限公司',
          jsdwfzr: '徐峥',
          zgbm: '系统设备部',
          xmfzr: '李文正',
          sgdw: '中铁一局集团电务工程有限公司',
          sgdwfzr: '李四',
          bz:
            '撒旦撒旦实打实水水水水水水水水水水水水撒旦撒旦实打实水水水水水水水水水水水水撒旦撒旦实打实水水水水水水水水水水水水撒旦撒旦实打实水水水水水水水水水水水水',
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
        bdmc: '无锡地铁4号线一期工程机电、装修安装工程',
        bdbm: '400123',
        htbh: 'DSADFFAS',
        htfl: '工程类',
        xl: '4号线',
        sfclbd: 0,
        jsdw: '无锡地铁集团有限公司',
        jsdwfzr: '徐峥',
        zgbm: '系统设备部',
        xmfzr: '李文正',
        sgdw: '中铁一局集团电务工程有限公司',
        sgdwfzr: '李四',
        bz:
          '撒旦撒旦实打实水水水水水水水水水水水水撒旦撒旦实打实水水水水水水水水水水水水撒旦撒旦实打实水水水水水水水水水水水水撒旦撒旦实打实水水水水水水水水水水水水',
      }
      this.systemData = {
        status: '审批完成',
        createTime: '2019/02/02 18:10',
        createPerson: '张三',
        modifyTime: '2019/02/02 18:10',
        modifyPerson: '张三',
      }
      this.singleProjectList = [
        { id: '1', dxgcmc: '具区路车辆段', zdwgcmc: '一层盖板', bz: '' },
      ]
      this.subUnitProjctList = [
        {
          id: '1',
          dxgcmc: '具区路车辆段',
          zdwgcmc: '一层盖板',
          gf: '3.74',
          bz: '',
        },
      ]
      this.feesList = [{ id: '1', zdwgcmc: '一层盖板', gf: '3.64', bz: '' }]
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
.mt15 {
  margin-top: 15px;
}
</style>
