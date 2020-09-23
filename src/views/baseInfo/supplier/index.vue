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
            node-key="key"
          ></el-tree>
        </el-card>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="18">
        <el-tabs type="border-card" v-model="tabKey">
          <el-tab-pane name="jcxx" label="供应商信息">
            <block-title title="基础信息" />
            <grid-form :settings="baseSettings(this.detail)"></grid-form>
            <block-title title="银行信息" />
            <el-table :data="customerBankList" border>
              <el-table-column prop="sdzzh" label="是否主账户" align="center">
                <template slot-scope="scope">
                  <el-checkbox disabled :value="!!scope.row.sfzzh"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column prop="yh" label="银行"></el-table-column>
              <el-table-column prop="fh" label="分行"></el-table-column>
              <el-table-column prop="yhzh" label="银行账户"></el-table-column>
              <el-table-column prop="lhh" label="联行号"></el-table-column>
              <el-table-column prop="zhsfzy" label="账户是否主要"></el-table-column>
            </el-table>
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
          <el-table-column align="center" label="供应商名称" prop="gysmc" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="供应商类型" prop="gyslx" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="供应商类别" prop="gyslb" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="供应商代码" prop="gysdm" :show-overflow-tooltip="true"></el-table-column>
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
  name: 'supplier',
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
          field: 'gysmc',
          alwaysShow: true,
          label: '供应商名称',
          render: (data) => (
            <el-input placeholder="供应商名称" vModel={data['gysmc']} />
          ),
        },
        {
          field: 'gyslx',
          alwaysShow: true,
          label: '供应商类型',
          render: (data) => (
            <el-input placeholder="供应商类型" vModel={data['gyslx']} />
          ),
        },
        {
          field: 'gyslb',
          label: '供应商类别',
          alwaysShow: true,
          render: (data) => (
            <el-input placeholder="供应商类别" vModel={data['gyslb']} />
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
      customerBankList: [],
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
            label: '供应商名称',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.gysmc,
          },
          {
            type: 'label',
            label: '供应商代码',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.gysdm,
          },
        ],
        [
          {
            type: 'label',
            label: '供应商主键',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.gyszj,
          },
          {
            type: 'label',
            label: '供应商标识',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.gysbs,
          },
        ],
        [
          {
            type: 'label',
            label: '供应商类别',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.gyslb,
          },
          {
            type: 'label',
            label: '供应商类型',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.gyslx,
          },
        ],
        [
          {
            type: 'label',
            label: '是否关联方',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.sfglf,
          },
          {
            type: 'label',
            label: '统一社会信用代码',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.tyshxydm,
          },
        ],
        [
          {
            type: 'label',
            label: '国家',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.gj,
          },
          {
            type: 'label',
            label: '省/自治区',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.sheng,
          },
        ],
        [
          {
            type: 'label',
            label: '市',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.shi,
          },
          {
            type: 'label',
            label: '是否禁用',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.sfjy,
          },
        ],
        [
          {
            type: 'label',
            label: '启用日期',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.qyrq,
          },
          {
            type: 'label',
            label: '失效日期',
            showBg: true,
          },
          {
            type: 'handler',
            disabled: true,
            render: () => data.sxrq,
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
          label: '供应商',
          children: [
            {
              key: '1-1',
              label: '供应商1',
            },
            {
              key: '1-2',
              label: '供应商2',
            },
            {
              key: '1-3',
              label: '供应商3',
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
          label: '供应商1',
          gysmc: '无锡广大汽车租赁有限公司',
          gysdm: 'GYS000000002',
          gyszj: '0',
          gysbs: '201901121012-F5D3-1C6',
          gyslb: '监理',
          gyslx: '工程类',
          sfglf: '是',
          tyshxydm: '9121123213213123123',
          gj: 'CN',
          sheng: '江苏',
          shi: '无锡',
          sfjy: '否',
          qyrq: '2020-02-12',
          sxrq: '2025-02-12',
          zt: '审批完成',
          cjsj: '2019/02/02 18:10',
          cjr: '张三',
          xgsj: '2019/02/02 18:10',
          xgr: '张三',
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
      // TODO 点击设置右侧显示参数
      this.detail = {
        gysmc: '无锡广大汽车租赁有限公司',
        gysdm: 'GYS000000002',
        gyszj: '0',
        gysbs: '201901121012-F5D3-1C6',
        gyslb: '监理',
        gyslx: '工程类',
        sfglf: '是',
        tyshxydm: '9121123213213123123',
        gj: 'CN',
        sheng: '江苏',
        shi: '无锡',
        sfjy: '否',
        qyrq: '2020-02-12',
        sxrq: '2025-02-12',
        zt: '审批完成',
        cjsj: '2019/02/02 18:10',
        cjr: '张三',
        xgsj: '2019/02/02 18:10',
        xgr: '张三',
      }
      this.customerBankList = [
        {
          id: '1',
          sfzzh: 1,
          yh: '交通银行',
          fh: '交通银行青山支行',
          yhzh: '6058182298765512',
          lhh: '103120230',
          zhsfzy: '是',
        },
      ]
    },
    onSelect(row) {
      this.currentKey = row.key
      const key = this.$refs.treeNode.setCurrentKey(row.key)
      this.detail = {
        gysmc: '无锡广大汽车租赁有限公司',
        gysdm: 'GYS000000002',
        gyszj: '0',
        gysbs: '201901121012-F5D3-1C6',
        gyslb: '监理',
        gyslx: '工程类',
        sfglf: '是',
        tyshxydm: '9121123213213123123',
        gj: 'CN',
        sheng: '江苏',
        shi: '无锡',
        sfjy: '否',
        qyrq: '2020-02-12',
        sxrq: '2025-02-12',
        zt: '审批完成',
        cjsj: '2019/02/02 18:10',
        cjr: '张三',
        xgsj: '2019/02/02 18:10',
        xgr: '张三',
      }
      this.customerBankList = [
        {
          id: '1',
          sfzzh: 1,
          yh: '交通银行',
          fh: '交通银行青山支行',
          yhzh: '6058182298765512',
          lhh: '103120230',
          zhsfzy: '是',
        },
      ]
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
