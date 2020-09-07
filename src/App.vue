<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}


</script>
<style>
  /* 解决element-ui的table表格控件表头与内容列不对齐问题 */
  .el-table th.gutter{
    display: table-cell!important;
  }

  element.style {
  }

  .el-input.is-disabled .el-input__inner{
    color: #333;
  }
  .el-radio__input.is-disabled+span.el-radio__label{
    color: #333;
  }
</style>
