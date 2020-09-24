
<template>
  <el-select
    :value="valueTitle"
    :clearable="clearable"
    @clear="clearHandle"
    :disabled="disabled"
    :placeholder="placeholder"
    ref="selectMain"
    @visible-change="onVisibleChange"
  >
    <el-input
      v-if="showFilter"
      v-model="filterText"
      style="padding: 10px"
      placeholder="请输入"
    ></el-input>
    <el-option :value="valueTitle" :label="valueTitle">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="treeOptions"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
        :filter-node-method="filterTree"
      >
      </el-tree>
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: 'TreeSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    /* 配置项 */
    props: {
      type: Object,
      default: () => {
        return {
          value: 'id', // ID字段名
          label: 'label', // 显示名称
          children: 'children', // 子级字段名
        }
      },
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => {
        return []
      },
    },
    /* 初始值 */
    value: {
      default: null,
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: true,
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: false,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: String,
    showFilter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valueId: this.value, // 初始值
      valueTitle: '',
      defaultExpandedKey: [],
      filterText: '', // 筛选输入
      treeOptions: [],
    }
  },
  watch: {
    value(value) {
      this.valueId = value
      this.initHandle()
    },
    filterText(val) {
      this.$refs.selectTree.filter(val)
    },
    options: {
      deep: true,
      handler(value) {
        this.treeOptions = value
        this.$nextTick(this.initHandle)
      },
    },
  },
  mounted() {
    this.treeOptions = this.options
    this.$nextTick(this.initHandle)
  },
  methods: {
    // 初始化值
    initHandle() {
      this.filterText = ''
      this.valueTitle = this.valueId
        ? this.$refs.selectTree.getNode(this.valueId).data[this.props.label]
        : '' // 初始化显示
      this.$refs.selectTree.setCurrentKey(this.valueId) // 设置默认选中
      this.defaultExpandedKey = this.valueId ? [this.valueId] : [] // 设置默认展开
      this.$nextTick(() => {
        let scrollWrap = document.querySelectorAll(
          '.el-scrollbar .el-select-dropdown__wrap'
        )[0]
        let scrollBar = document.querySelectorAll(
          '.el-scrollbar .el-scrollbar__bar'
        )
        scrollWrap.style.cssText =
          'margin: 0px; max-height: none; overflow: hidden;'
        scrollBar.forEach((ele) => (ele.style.width = 0))
      })
    },
    // 切换选项
    handleNodeClick(node) {
      this.valueTitle = node[this.props.label]
      this.valueId = node[this.props.value]
      this.$emit('change', this.valueId)
      this.defaultExpandedKey = [this.valueId]
      this.$refs.selectMain.blur()
    },
    // 清除选中
    clearHandle() {
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.clearSelected()
      this.$emit('change', null)
    },
    /* 清空选中样式 */
    clearSelected() {
      let allNode = document.querySelectorAll('#tree-option .el-tree-node')
      allNode.forEach((element) => element.classList.remove('is-current'))
    },
    // 树筛选函数 默认对label筛选
    filterTree(value, data) {
      if (!value) return true
      return data[this.props.label].indexOf(value) !== -1
    },
    // select下拉框显示，清空筛选，收起树
    onVisibleChange(visible) {
      if (!visible) return
      this.treeOptions = [...this.options]
      this.$nextTick(this.initHandle)
    },
  },
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
</style>
