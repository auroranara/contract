<template>
  <el-form ref="form" :model="model" :rules="rules" :hide-required-asterisk="true">
    <div class="table-border">
      <table cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr v-for="(row, index) in settings" :key="index">
          <cellItem v-for="(col, i) in row" :setting="col" :data="model" :key="i"></cellItem>
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
<style lang="scss" scoped>
$border: #d3d3d3;
.table-border {
  margin-bottom: 20px;
  border: 1px solid $border;
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
}
</style>
