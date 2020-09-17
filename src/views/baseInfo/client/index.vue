<template>
  <div class="app-container">
    <div class="head-container">
      <expand-Filter :fields="fields" :model="listQuery" type="inline" :showLabel="false">
        <template v-slot:operations>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
          <el-button type="primary">新增</el-button>
          <el-button type="primary" @click="onSave">保存</el-button>
          <el-button type="primary">删除</el-button>
        </template>
      </expand-Filter>
    </div>
    <el-row :gutter="10">
      <!-- 左侧树 -->
      <el-col :span="6">
        <el-card>
          <el-tree
            ref="treeNode"
            :highlight-current="true"
            :data="list"
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
          <el-tab-pane name="jcxx" label="客户信息">
            <block-title title="基础信息" />
            <grid-form
              ref="gridForm"
              :settings="baseSettings(this.detail)"
              :model="detail"
              :rules="rules"
            ></grid-form>
            <block-title title="银行信息" />
            <el-table :data="bankInfoList" border>
              <el-table-column width="100" prop="sdzzh" label="是否主账户" align="center">
                <template slot-scope="scope">
                  <el-checkbox disabled :value="!!scope.row.sfzzh"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column width="150" prop="zhxx" label="总行信息" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column width="150" prop="khh" label="开户行" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column width="100" prop="sheng" label="省" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column width="150" prop="fhmc" label="分行名称" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column width="150" prop="lhh" label="联行号" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column width="100" prop="khr" label="开户人" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column width="150" prop="dzqz" label="电子签章" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column
                width="150"
                prop="sfjsdzyp"
                label="是否接受电子银票"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column width="150" prop="bz" label="备注" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="xtxx" label="系统信息">
            <el-row>
              <el-col :md="12" :sm="24">
                <grid-form :settings="systemSettings(this.systemInfo)"></grid-form>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ExpandFilter from '@/components/ExpandFilter'
import GridForm from '@/components/GridForm'
import BlockTitle from '@/components/BlockTitle'
import { mapState } from 'vuex'

export default {
  name: 'supplier',
  components: {
    ExpandFilter,
    GridForm,
    BlockTitle,
  },
  data() {
    return {
      // 当前tab的key
      tabKey: 'jcxx',
      // 查询query信息
      listQuery: {},
      // 基础信息
      detail: {},
      // 系统信息
      systemInfo: {
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
          key: '1',
          label: '客户',
          children: [
            {
              key: '1-1',
              label: '客户1',
            },
            {
              key: '1-2',
              label: '客户2',
            },
            {
              key: '1-3',
              label: '客户3',
            },
          ],
        },
      ],
      currentKey: null,
      bankInfoList: [],
      rules: {
        khmc: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        sfglf: [
          { required: true, message: '请输入是否关联方', trigger: 'blur' },
        ],
      },
      fields: [
        {
          field: 'khmc',
          alwaysShow: true,
          label: '客户名称',
          render: (data) => (
            <el-input placeholder="客户名称" vModel={data['khmc']} />
          ),
        },
        {
          field: 'zhuangtai',
          label: '状态',
          alwaysShow: true,
          render: (data) => (
            <el-select vModel={data['zhuangtai']}>
              {this.statusDict.map(({ value, label }) => (
                <el-option key={value} value={value} label={label}></el-option>
              ))}
            </el-select>
          ),
        },
        {
          field: 'gj',
          label: '国家',
          render: (data) => <el-input placeholder="国家" vModel={data['gj']} />,
        },
        {
          field: 'sheng',
          label: '省/自治区',
          render: (data) => (
            <el-input placeholder="省/自治区" vModel={data['sheng']} />
          ),
        },
        {
          field: 'shi',
          label: '市',
          render: (data) => <el-input placeholder="市" vModel={data['shi']} />,
        },
      ],
    }
  },
  computed: {
    ...mapState({
      statusDict: (state) => state.baseInfo.statusDict,
    }),
  },
  methods: {
    baseSettings(data) {
      return [
        [
          {
            type: 'label',
            label: '客户名称',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'khmc',
            render: (data) => <el-input vModel={data['khmc']} />,
          },
          {
            type: 'label',
            label: '客户编码',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'khbm',
            disabled: true,
            render: (data) => <el-input readonly vModel={data['khbm']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '是否关联方',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'sfglf',
            render: (data) => <el-input vModel={data['sfglf']} />,
          },
          {
            type: 'label',
            label: '是否一般纳税人',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'sfybnsr',
            render: (data) => <el-input vModel={data['sfybnsr']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '开票抬头',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'kqtt',
            render: (data) => <el-input vModel={data['kqtt']} />,
          },
          {
            type: 'label',
            label: '统一社会信用代码',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'tyshxydm',
            render: (data) => <el-input vModel={data['tyshxydm']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '国家',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'gj',
            render: (data) => <el-input vModel={data['gj']} />,
          },
          {
            type: 'label',
            label: '省/自治区',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'sheng',
            render: (data) => <el-input vModel={data['sheng']} />,
          },
        ],
        [
          {
            type: 'label',
            label: '市',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'shi',
            render: (data) => <el-input vModel={data['shi']} />,
          },
          {
            type: 'label',
            label: '地址、电话',
            showBg: true,
            required: true,
          },
          {
            type: 'handler',
            field: 'dizhi',
            render: (data) => <el-input vModel={data['dizhi']} />,
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
    onReset() {
      this.currentKey = null
      const key = this.$refs.treeNode.setCurrentKey()
      this.detail = {}
      this.bankInfoList = []
    },
    onTreeNodeClick(data) {
      this.currentKey = data.key
      // TODO 点击设置右侧显示参数
      this.detail = {
        khmc: '',
        khbm: 'JS0099156',
        sfglf: '否',
        sfybnsr: '是',
        kqtt: '江苏普信土地房地产资产评估测绘有限公司',
        tyshxydm: '912000123213F',
        gj: '中国',
        sheng: '江苏',
        shi: '无锡',
        dizhi: '无锡新区旺庄路52-2101232',
      }
      this.bankInfoList = [
        {
          id: '1',
          sfzzh: 1,
          zhxx: '交通银行',
          khh: '交通银行青山支行',
          sheng: '江苏省',
          shi: '无锡市',
          fhmc: '交通银行股份有限公司',
          yhzh: '6058182298765512',
          lhh: '103120230',
        },
      ]
    },
    onSave() {
      this.$refs['gridForm'].$refs['form'].validate((valid, err) => {
        if (err) {
          const h = this.$createElement
          const msg = Object.entries(err)
            .map((item) => item[1].map((val) => val.message).join('，'))
            .join('\n')
          console.log('msg', msg)
          this.$notify.error({
            title: '校验错误信息',
            message: h('div', { style: 'white-space:pre-wrap' }, msg),
            duration: 20000,
          })
        } else {
          console.log('form', this.detail)
        }
      })
    },
  },
}
</script>
