<template>
  <el-form
    ref="form"
    :model="staff"
    :rules="rules"
    label-width="100px"
    class="filter-item"
    style="width: 800px"
  >
    <el-form-item label="个人技能" prop="skill">
      <el-checkbox-group v-model="staff.skill">
        <el-checkbox v-for="skill in skillOptions" :label="skill.value" :key="skill.value">{{skill.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="培训结果" prop="train">
      <el-checkbox-group v-model="staff.trainningResult">
        <el-checkbox
          v-for="train in trainOptions"
          :key="train.value"
          :label="train.value"
        >{{train.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="附件" prop="files">
      <el-upload
        class="upload-demo"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-upload="beforeAvatarUpload"
        :before-remove="beforeRemove"
        :on-success="handleAvatarSuccess"
        :file-list="staff.acc || []"
        :multiple="false"
        :action="action"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <span style="marginLeft: 10px">支持扩展名：.pdf .jpg...</span>
      </el-upload>
    </el-form-item>
  </el-form>
</template>

<script>
import { downloadWorkSiteFile } from '@/utils/index'

export default {
  name: 'SkillForm',
  props: ['staff', 'skillOptions', 'trainOptions'],
  data() {
    return {
      action: '/end/file/upload/ftp',
      rules: {
        skill: [{ required: true, message: '请选择技能', trigger: 'blur' }]
      }
    }
  },
  created: function() {},
  methods: {
    formValid: function() {
      let result = true
      this.$refs['form'].validate(valid => {
        if (!valid) {
          result = false
        }
      })
      return result
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传附件大小不能超过 20MB!')
      }
      return isLt2M
    },
    handlePreview(file) {
      downloadWorkSiteFile(file.name, file.path)
    },
    handleRemove(file, fileList) {
      this.staff.acc = fileList.map(item => {
        return {
          name: item.name,
          path: item.response ? item.response.data : ''
        }
      })
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleAvatarSuccess(res, file, fileList) {
      this.staff.acc = fileList.map(item => {
        return {
          name: item.name,
          path: item.response ? item.response.data : ''
        }
      })
    }
  }
}
</script>

<style></style>
