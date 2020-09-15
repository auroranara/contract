<template>
  <div class="app-container">
    <div class="head-container">
      <!-- <expand-Filter :layout="{md:8,sm:12}" :fields="fields" :model="listQuery">
        <template v-slot:operations>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
        </template>
      </expand-Filter>-->
      <el-button type="primary">刷新</el-button>
    </div>
    <el-row :gutter="10">
      <!-- 左侧树 -->
      <el-col :span="6">
        <el-card>
          <el-tree
            :highlight-current="true"
            :data="list"
            :props="treeProps"
            :default-expand-all="true"
            @node-click="onTreeNodeClick"
          ></el-tree>
        </el-card>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="18">
        <el-tabs type="border-card" v-model="tabKey">
          <el-tab-pane name="jcxx" label="基础信息">
            <grid-form :settings="baseSettings(this.detail)"></grid-form>
          </el-tab-pane>
          <el-tab-pane name="yhxx" label="银行信息">
            <el-table :data="bankInfoList" border>
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
  </div>
</template>
<script>
// import ExpandFilter from '@/components/ExpandFilter'
import GridForm from '@/components/GridForm'

export default {
  name: 'supplier',
  components: {
    // ExpandFilter,
    GridForm,
  },
  data() {
    return {
      // 当前tab的key
      tabKey: 'jcxx',
      // 查询query信息
      listQuery: {},
      // fields: [
      //   {
      //     field: 'gysmc',
      //     alwaysShow: true,
      //     label: '供应商名称',
      //     render: (data) => (
      //       <el-input placeholder="请输入" vModel={data['gysmc']} />
      //     ),
      //   },
      //   {
      //     field: 'gyslx',
      //     alwaysShow: true,
      //     label: '供应商类型',
      //     render: (data) => (
      //       <el-input placeholder="请输入" vModel={data['gyslx']} />
      //     ),
      //   },
      //   {
      //     field: 'gyslb',
      //     label: '供应商类别',
      //     alwaysShow: true,
      //     render: (data) => (
      //       <el-input placeholder="请输入" vModel={data['gyslb']} />
      //     ),
      //   },
      //   {
      //     field: 'gj',
      //     label: '国家',
      //     render: (data) => (
      //       <el-input placeholder="请输入" vModel={data['gj']} />
      //     ),
      //   },
      //   {
      //     field: 'shen',
      //     label: '省/自治区',
      //     render: (data) => (
      //       <el-input placeholder="请输入" vModel={data['shen']} />
      //     ),
      //   },
      //   {
      //     field: 'shi',
      //     label: '市',
      //     render: (data) => (
      //       <el-input placeholder="请输入" vModel={data['shi']} />
      //     ),
      //   },
      // ],
      // 基础信息
      detail: {
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
      treeProps: {
        children: 'children',
        label: 'label',
      },
      // 左侧树
      list: [
        {
          label: '供应商',
          children: [
            {
              label: '供应商1',
            },
            {
              label: '供应商2',
            },
            {
              label: '供应商3',
            },
          ],
        },
      ],
      bankInfoList: [
        {
          id: '1',
          sfzzh: 1,
          yh: '交通银行',
          fh: '交通银行青山支行',
          yhzh: '6058182298765512',
          lhh: '103120230',
          zhsfzy: '是',
        },
      ],
    }
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
            render: () => data.gysmc,
          },
          {
            type: 'label',
            label: '供应商代码',
            showBg: true,
          },
          {
            type: 'handler',
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
            render: () => data.gyszj,
          },
          {
            type: 'label',
            label: '供应商标识',
            showBg: true,
          },
          {
            type: 'handler',
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
            render: () => data.gyslb,
          },
          {
            type: 'label',
            label: '供应商类型',
            showBg: true,
          },
          {
            type: 'handler',
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
            render: () => data.sfglf,
          },
          {
            type: 'label',
            label: '统一社会信用代码',
            showBg: true,
          },
          {
            type: 'handler',
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
            render: () => data.gj,
          },
          {
            type: 'label',
            label: '省/自治区',
            showBg: true,
          },
          {
            type: 'handler',
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
            render: () => data.shi,
          },
          {
            type: 'label',
            label: '是否禁用',
            showBg: true,
          },
          {
            type: 'handler',
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
            render: () => data.qyrq,
          },
          {
            type: 'label',
            label: '失效日期',
            showBg: true,
          },
          {
            type: 'handler',
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
    onSearch() {},
    onReset() {},
    onTreeNodeClick(data) {
      console.log('click node', data)
      // TODO 点击设置右侧显示参数
    },
  },
}
</script>
