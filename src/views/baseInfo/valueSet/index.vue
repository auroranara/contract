<template>
  <div class="app-container">
    <div class="head-container">
      <el-button plain type="primary" icon="el-icon-search" @click="onClickSearch">查询</el-button>
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
            node-key="key"
          ></el-tree>
        </el-card>
      </el-col>
      <!-- 右侧内容 -->
      <el-col :span="18">
        <el-tabs type="border-card" v-model="tabKey">
          <el-tab-pane name="jcxx" label="供应商信息">
            <block-title title="基础信息" />

            <grid-form
              ref="gridForm"
              :settings="baseSettings(this.detail,type)"
              :model="detail"
              :rules="rules"
            ></grid-form>

            <block-title title="参数列表" />

            <el-button v-if="!isDetail" size="small" type="primary" @click="handleAddParams">新增</el-button>
            <el-button
              v-if="!isDetail"
              size="small"
              type="danger"
              :disabled="!(selectedParams&&selectedParams.length)"
              @click="handleDeleteParams"
            >删除</el-button>
            <el-table
              style="margin-top:10px"
              :data="paramsList"
              border
              @selection-change="handleParamsChange"
            >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column prop="mc" label="名称" :show-overflow-tooltip="true" align="center">
                <template slot-scope="scope">
                  <el-input v-if="!isDetail" v-model="paramsList[scope.$index].mc"></el-input>
                  <span v-else>{{scope.row.mc}}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="200"
                prop="bm"
                label="编码"
                :show-overflow-tooltip="true"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input v-if="!isDetail" v-model="paramsList[scope.$index].bm"></el-input>
                  <span v-else>{{scope.row.bm}}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="200"
                prop="zt"
                label="状态"
                :show-overflow-tooltip="true"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input v-if="!isDetail" v-model="paramsList[scope.$index].zt"></el-input>
                  <span v-else>{{scope.row.zt}}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="200"
                prop="sx1"
                label="属性1"
                :show-overflow-tooltip="true"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input v-if="!isDetail" v-model="paramsList[scope.$index].sx1"></el-input>
                  <span v-else>{{scope.row.sx1}}</span>
                </template>
              </el-table-column>
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
          <el-table-column align="center" label="值集名称" prop="zjmc" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="值集编码" prop="zjbm" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="状态" prop="zt" :show-overflow-tooltip="true"></el-table-column>
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
import { mapState } from 'vuex'

export default {
  name: 'valueSet',
  components: {
    ExpandFilter,
    GridForm,
    BlockTitle,
    Pagination,
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
      fields: [
        {
          field: 'zjmc',
          alwaysShow: true,
          label: '值集名称',
          render: (data) => (
            <el-input placeholder="值集名称" vModel={data['zjmc']} />
          ),
        },
        {
          field: 'zjbm',
          alwaysShow: true,
          label: '值集编码',
          render: (data) => (
            <el-input placeholder="供应商类型" vModel={data['zjbm']} />
          ),
        },
        {
          field: 'zt',
          label: '状态',
          alwaysShow: true,
          render: (data) => (
            <el-select vModel={data['zt']}>
              {this.statusDict.map(({ value, label }) => (
                <el-option key={value} value={value} label={label}></el-option>
              ))}
            </el-select>
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
      // 参数列表勾选
      selectedParams: [],
      // 参数列表
      paramsList: [],
      rules: {
        zjmc: [{ required: true, message: '请输入值集名称', trigger: 'blur' }],
        qysj: [{ required: true, message: '请输入值集名称', trigger: 'blur' }],
        zhuangtai: [{ required: true, message: '请选择状态', trigger: 'blur' }],
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
    baseSettings(data, type) {
      const isAdd = type === 'add'
      const isAdjust = type === 'adjust'
      const isDetail = type === 'detail'
      return [
        [
          {
            type: 'label',
            label: '值集名称',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'zjmc',
            disabled: isDetail,
            render: () => (
              <el-input readonly={isDetail} vModel={data['zjmc']} />
            ),
          },
          {
            type: 'label',
            label: '值集编码',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'zjbm',
            disabled: true,
            render: () => (
              <el-input readonly={isDetail} readonly vModel={data['zjbm']} />
            ),
          },
        ],
        [
          {
            type: 'label',
            label: '启用时间',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'qysj',
            disabled: isDetail,
            render: () => (
              <el-date-picker
                readonly={isDetail}
                vModel={data['qysj']}
                type="datetime"
                style="width:100%"
              ></el-date-picker>
            ),
          },
          {
            type: 'label',
            label: '状态',
            showBg: true,
          },
          {
            type: 'handler',
            field: 'zhuangtai',
            disabled: isDetail,
            render: () => (
              <el-select
                disabled={isDetail}
                vModel={data['zhuangtai']}
                style="width:100%"
              >
                {this.statusDict.map(({ value, label }) => (
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
          label: '招标方式',
          zjmc: '招标方式',
          zjbm: '0202',
          qysj: new Date(),
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
      this.$refs.treeNode.setCurrentKey(data.key)
      this.$router.replace(`${this.basePath}/list`)
      // TODO 点击设置右侧显示参数
      this.detail = {
        key: '1-1',
        label: '招标方式',
        zjmc: '招标方式招标方式招标方式招标方式招标方式招标方式',
        zjbm: '0202',
        qysj: new Date(),
        zhuangtai: '1',
        zt: '审批完成',
        cjsj: '2019/02/02 18:10',
        cjr: '张三',
        xgsj: '2019/02/02 18:10',
        xgr: '张三',
      }
    },
    onSelect(row) {
      this.onTreeNodeClick(row)
      this.queryDialogVisible = false
    },
    onResetInfo() {
      this.detail = {}
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
    onSave() {
      this.$refs['gridForm'].$refs['form'].validate((valid, err) => {
        if (err) {
          const msg = Object.entries(err)
            .map((item) => item[1].map((val) => val.message).join('，'))
            .join('\n')
          this.$notify.error({
            title: '校验错误信息',
            message: this.$createElement(
              'div',
              { style: 'white-space:pre-wrap' },
              msg
            ),
            duration: 20000,
          })
        } else {
          console.log('form', this.detail)
        }
      })
    },
    handleAddParams() {
      this.paramsList = [...this.paramsList, { id: Date.now() }]
    },
    handleDeleteParams() {
      if (Array.isArray(this.selectedParams) && this.selectedParams.length) {
        this.paramsList = this.paramsList.filter(
          (item) => !this.selectedParams.some((val) => val.id === item.id)
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
  },
}
</script>
<style lang="scss" scoped>
.dialog-content {
  min-height: 350px;
}
</style>
