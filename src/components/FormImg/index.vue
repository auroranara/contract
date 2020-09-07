<template>
  <div class="img-container">
    <el-image style="width: 180px; height: 180px" :src="src" fit="contain"></el-image>
    <span class="img-actions">
      <span class="action-icon" @click="zoomImg">
        <i class="el-icon-view" />
      </span>
      <span class="action-icon" @click="deleteImg">
        <i class="el-icon-delete" />
      </span>
    </span>
    <el-dialog append-to-body :visible.sync="dialogVisible" width="45%">
      <el-image style="width: 100%" :src="src" fit="contain"></el-image>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'FormImg',
  props: {
    src: {
      type: String,
      default: null
    },
    onDelete: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    deleteImg() {
      const that = this
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        that.onDelete()
      })
    },
    zoomImg() {
      this.dialogVisible = true
    }
  }
}
</script>

<style>
.img-container {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 6px;
}
.img-container:hover .img-actions {
  opacity: 1;
}
.img-item {
  width: 100%;
  height: 100%;
}
.img-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.action-icon {
  display: inline-block;
  cursor: pointer;
}
</style>
