<template>
  <div class="top-menu">
    <el-menu mode="horizontal" :unique-opened="true" @select="handleSelect">
      <el-submenu index="xmgl">
        <template slot="title">项目管理</template>
        <el-menu-item index="xmgl1">选项1</el-menu-item>
        <el-menu-item index="xmgl2">选项2</el-menu-item>
        <el-menu-item index="xmgl3">选项3</el-menu-item>
      </el-submenu>
      <el-submenu index="zjgl">
        <template slot="title">造价管理</template>
        <el-menu-item index="zjgl1">选项1</el-menu-item>
      </el-submenu>
      <el-submenu index="zbgl">
        <template slot="title">招标管理</template>
        <el-menu-item index="zbgl1">选项1</el-menu-item>
      </el-submenu>
      <el-submenu index="htgl">
        <template slot="title">合同管理</template>
        <el-menu-item index="htgl1">选项1</el-menu-item>
      </el-submenu>
      <el-submenu index="htgl1">
        <template slot="title">合同管理1</template>
        <el-menu-item index="htgl1-1">选项1</el-menu-item>
      </el-submenu>
      <el-submenu index="htgl2">
        <template slot="title">合同管理2</template>
        <el-menu-item index="htgl2-1">选项1</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'TopSidbar',
  data() {
    return {}
  },
  methods: {
    handleSelect() {},
  },
}
</script>
<style lang="scss">
.top-menu {
  .el-menu--horizontal > .el-submenu .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }
  .el-submenu__title {
    padding: 0;
    margin: 0 20px;
  }
}
</style>
