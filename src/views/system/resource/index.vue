<template>
  <div class="app-container calendar-list-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>资源</span>
            <el-button
              v-permission="['resources:add']"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-plus"
              @click="addResource"
            >新增</el-button>
            <el-button
              v-permission="['resources:del']"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-delete"
              @click="delResource"
            >删除</el-button>
          </div>
          <div style="height:500px;    overflow-y: auto">
            <el-tree
              ref="resourceTree"
              :expand-on-click-node="false"
              :data="resourceData"
              :accordion="false"
              :props="defaultResourceProps"
              :check-strictly="true"
              node-key="id"
              show-checkbox
              check-on-click-node
              @check-change="handleResourceNodeChange"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button
              v-permission="['resources:edit']"
              class="filter-item"
              style="margin-left: 10px;"
              type="primary"
              icon="el-icon-edit"
              @click="editResource"
            >编辑</el-button>
          </div>
          <div class="component-item">
            <el-form
              ref="dataFormEdit"
              :rules="rules"
              :model="temp"
              label-position="left"
              label-width="100px"
              style="width: 400px; margin-left:50px;"
            >
              <el-form-item label="所属资源">
                <el-input v-model="temp.parentName" :disabled="true" />
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select v-model="temp.type" label="类型" prop="type">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="temp.type===0" label="菜单图标">
                <el-popover
                  placement="bottom-start"
                  width="450"
                  trigger="click"
                  @show="$refs['iconSelect'].reset()"
                >
                  <IconSelect ref="iconSelect" @selected="selected" />
                  <el-input
                    slot="reference"
                    v-model="temp.icon"
                    style="width: 450px;"
                    placeholder="点击选择图标"
                    clearable
                  >
                    <svg-icon
                      v-if="temp.icon"
                      slot="prefix"
                      :icon-class="temp.icon"
                      class="el-input__icon"
                      style="height: 32px;width: 16px;"
                    />
                    <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                  </el-input>
                </el-popover>
              </el-form-item>
              <el-form-item v-if="temp.type===0" label="是否缓存" prop="cache">
                <el-select v-model="temp.cache" label="是否缓存">
                  <el-option :key="0" label="是" :value="0" />
                  <el-option :key="1" label="否" :value="1" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="temp.type===0" label="是否隐藏" prop="hidden">
                <el-select v-model="temp.hidden">
                  <el-option :key="0" label="是" :value="0" />
                  <el-option :key="1" label="否" :value="1" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="temp.type===0" label="重定向" prop="redirect">
                <el-autocomplete
                  v-model="temp.redirect"
                  :fetch-suggestions="redirectQuery"
                  style="width:100%"
                />
              </el-form-item>
              <el-form-item v-if="temp.type===0" label="组件名称" prop="componentName">
                <el-input v-model="temp.componentName" placeholder="请输入组件名称" />
              </el-form-item>
              <el-form-item v-if="temp.type===0" label="组件路径" prop="component">
                <el-autocomplete
                  v-model="temp.component"
                  placeholder="请输入组件路径"
                  :fetch-suggestions="componentQuery"
                  style="width:100%"
                />
              </el-form-item>
              <el-form-item label="资源名称" prop="name">
                <el-input v-model="temp.name" placeholder="请输入资源名称" />
              </el-form-item>
              <el-form-item label="资源路径" prop="url">
                <el-input v-model="temp.url" placeholder="请输入资源路径" />
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input-number v-model="temp.sort" placeholder="请填写顺序" />
              </el-form-item>
              <el-form-item v-if="temp.type!==0" label="请求方式" prop="requestType">
                <el-select v-model="temp.requestType" label="请求方式" prop="requestType">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="temp.type!==0" label="资源CODE" prop="code">
                <el-input v-model="temp.code" placeholder="请输入code" />
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      title="新增资源"
      :destroy-on-close="true"
      append-to-body
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="saveResourceData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="所属资源">
          <el-input v-model="saveResourceData.parentName" :disabled="true" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="saveResourceData.type">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="saveResourceData.type===0" label="菜单图标">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selectedDialog" />
            <el-input
              slot="reference"
              v-model="saveResourceData.icon"
              style="width: 450px;"
              placeholder="点击选择图标"
              clearable
            >
              <svg-icon
                v-if="saveResourceData.icon"
                slot="prefix"
                :icon-class="saveResourceData.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item v-if="saveResourceData.type===0" label="是否缓存" prop="cache">
          <el-select v-model="saveResourceData.cache">
            <el-option :key="0" label="是" :value="0" />
            <el-option :key="1" label="否" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="saveResourceData.type===0" label="是否隐藏" prop="hidden">
          <el-select v-model="saveResourceData.hidden">
            <el-option :key="0" label="是" :value="0" />
            <el-option :key="1" label="否" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="saveResourceData.type===0" label="重定向" prop="redirect">
          <el-autocomplete
            v-model="saveResourceData.redirect"
            :fetch-suggestions="redirectQuery"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item v-if="saveResourceData.type===0" label="组件名称" prop="componentName">
          <el-input v-model="saveResourceData.componentName" placeholder="请输入组件名称" />
        </el-form-item>
        <el-form-item v-if="saveResourceData.type===0" label="组件路径" prop="component">
          <el-autocomplete
            v-model="saveResourceData.component"
            placeholder="请输入组件路径"
            :fetch-suggestions="componentQuery"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="saveResourceData.name" placeholder="请输入资源名称" />
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="saveResourceData.url" placeholder="请输入资源路径" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="saveResourceData.sort" placeholder="请填写顺序" />
        </el-form-item>
        <el-form-item v-if="saveResourceData.type!==0" label="请求方式" prop="requestType">
          <el-select v-model="saveResourceData.requestType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="saveResourceData.type!==0" label="资源CODE" prop="code">
          <el-input v-model="saveResourceData.code" placeholder="请输入code" />
        </el-form-item>
        <el-input v-model="saveResourceData.parentId" type="hidden" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import IconSelect from '@/components/IconSelect'
import {
  queryResources,
  saveResource,
  delResource,
  updateResource,
} from '@/api/system/resource'
export default {
  components: { IconSelect },
  data() {
    return {
      typeOptions: [
        {
          value: 0,
          label: '菜单',
        },
        {
          value: 2,
          label: '按钮',
        },
        {
          value: 3,
          label: 'url',
        },
      ],
      options: [
        {
          value: 'GET',
          label: 'GET',
        },
        {
          value: 'POST',
          label: 'POST',
        },
        {
          value: 'PUT',
          label: 'PUT',
        },
        {
          value: 'DELETE',
          label: 'DELETE',
        },
      ],
      resourceData: [],
      defaultResourceProps: {
        children: 'children',
        label: 'label',
        url: '',
        parentId: '',
      },
      rules: {
        name: [{ required: true, message: '请填写资源名称', trigger: 'blur' }],
        url: [{ required: true, message: '请填写资源路径', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        sort: [{ required: true, message: '请填写排序', trigger: 'blur' }],
        cache: [
          { required: true, message: '请选择是否缓存', trigger: 'change' },
        ],
        hidden: [
          { required: true, message: '请选择是否隐藏', trigger: 'change' },
        ],
        code: [{ required: true, message: '请填写资源code', trigger: 'blur' }],
        requestType: [
          { required: true, message: '请选择请求方式', trigger: 'change' },
        ],
        component: [
          { required: true, message: '请填写组件路径', trigger: 'change' },
        ],
        componentName: [
          { required: true, message: '请填写组件名称', trigger: 'blur' },
        ],
      },
      temp: {
        sort: 1,
        icon: '',
      },
      saveResourceData: {
        icon: '',
      },
      dialogFormVisible: false,
    }
  },
  mounted: function () {
    this.loadResourceNode()
  },
  methods: {
    handleResourceNodeChange(data, checked, indeterminat) {
      if (checked) {
        this.temp = {
          id: data.id,
          name: data.label,
          url: data.url,
          icon: data.icon,
          type: Number(data.type),
          sort: data.sort,
          requestType: data.requestType,
          code: data.code,
          hidden: data.hidden,
          cache: data.cache,
          redirect: data.redirect,
          componentName: data.componentName,
          component: data.component,
        }
        if (
          data.parentId !== null &&
          data.parentId !== 0 &&
          data.parentId !== ''
        ) {
          const parentNode = this.$refs.resourceTree.getNode(data.parentId)
          this.temp.parentName = parentNode.label
        } else {
          this.temp.parentName = ''
        }

        this.$refs.resourceTree.setCheckedNodes([data])
      }
    },
    loadResourceNode() {
      queryResources().then((res) => {
        this.resourceData = res.data
      })
    },
    resetTemp() {
      this.temp = {
        sort: 1,
        icon: '',
      }
    },
    resetSaveResourceData() {
      this.saveResourceData = {
        icon: '',
      }
    },
    addResource() {
      const checkNodes = this.$refs.resourceTree.getCheckedNodes()
      this.resetSaveResourceData()
      if (checkNodes.length > 0) {
        this.saveResourceData.parentName = checkNodes[0].label
        this.saveResourceData.parentId = checkNodes[0].id
      } else {
        this.saveResourceData.parentId = 0
      }
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    createData() {
      // 创建资源
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveResource(this.saveResourceData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000,
            })
            this.loadResourceNode()
          })
        }
      })
    },
    delResource() {
      const checkedKeys = this.$refs.resourceTree.getCheckedKeys()
      if (checkedKeys.length !== 1) {
        this.$message.error('请选择一个资源')
        return
      }
      delResource(checkedKeys[0]).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000,
        })
        this.loadResourceNode()
      })
    },
    editResource() {
      const checkedKeys = this.$refs.resourceTree.getCheckedKeys()
      if (checkedKeys.length !== 1) {
        this.$message.error('请选择一个资源')
        return
      }
      this.$refs['dataFormEdit'].validate((valid) => {
        if (valid) {
          updateResource(this.temp).then(() => {
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000,
            })
            this.loadResourceNode()
          })
        }
      })
    },
    // 选中图标
    selected(name) {
      this.temp.icon = name
    },
    selectedDialog(name) {
      this.saveResourceData.icon = name
    },
    // 重定向提示
    redirectQuery(queryString, cb) {
      cb([{ value: 'noredirect' }])
    },
    // 组件路径提示
    componentQuery(queryString, cb) {
      cb([
        { value: 'Layout' },
        { value: 'RouterView' },
        { value: 'Developing' },
      ])
    },
  },
}
</script>
<style>
.el-form-item {
  width: 100% !important;
}
.w-input {
  width: 75%;
}
</style>
