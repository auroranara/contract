<template>
  <el-form ref="form" :model="model" :rules="rules" :hide-required-asterisk="true">
    <div class="table-border">
      <table cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr v-for="(row, index) in settings" :v-if="row&&row.length" :key="index">
          <cellItem v-for="(col, i) in row" :setting="col" :rules="rules" :data="model" :key="i"></cellItem>
        </tr>
      </table>
    </div>
  </el-form>
</template>
<script>
import cellItem from './cellItem'

export default {
  name: 'gridForm',
  props: ['rules', 'model', 'settings'],
  components: {
    cellItem,
  },
}
</script>
<style lang="scss">
@import '~@/assets/styles/variables.scss';

.table-border {
  margin-bottom: 20px;
  border: 1px solid $gridBorder;
  border-right: none;
  border-bottom: none;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  background-color: #fff;
  font-size: 14px;
  color: #606266;
  .el-textarea__inner,
  .el-input__inner {
    border: none;
    background: transparent;
    text-overflow: ellipsis;
  }
}
</style>
