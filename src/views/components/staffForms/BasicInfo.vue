<template>
  <el-form
    ref="form"
    :model="staff"
    :rules="rules"
    label-width="100px"
    class="filter-item"
    style="width: 800px"
  >
    <el-form-item label="姓名" prop="name">
      <el-input v-model="staff.name" placeholder="请输入姓名" maxlength="200" style="width: 500px" />
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="staff.sex">
        <el-radio label="0">男</el-radio>
        <el-radio label="1">女</el-radio>
        <el-radio label="2">保密</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="出生日期" prop="birthday">
      <el-date-picker v-model="staff.birthday" type="date" placeholder="选择日期" />
    </el-form-item>
    <el-form-item label="联系方式" prop="phone">
      <el-input
        v-model="staff.phone"
        placeholder="请输入负责人联系方式"
        maxlength="200"
        style="width: 500px"
      />
    </el-form-item>
    <el-form-item label="证件类型" prop="credentialsType">
      <el-radio-group v-model="staff.credentialsType">
        <el-radio
          v-for="type in dict.CREDENTIAL_TYPE"
          :key="type.id"
          :label="type.value"
        >{{ type.label }}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="证件号码" prop="credentialsNo">
      <el-input
        v-model="staff.credentialsNo"
        placeholder="请输入证件号码"
        maxlength="200"
        style="width: 500px"
      />
    </el-form-item>

    <el-form-item label="备注" prop="remark">
      <el-input v-model="staff.remark" type="textarea" :rows="4" placeholder="请输入说明" />
    </el-form-item>

    <el-form-item label="个人头像" prop="displayPhoto">
      <el-upload
        v-if="!staff.displayPhoto"
        list-type="picture-card"
        :show-file-list="false"
        :on-success="handleDisplayPhotoSuccess"
        :on-remove="handleDisplayPhotoRemove"
        :before-upload="beforeAvatarUpload"
        :action="action"
        :headers="headers"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <ul v-else class="el-upload-list el-upload-list--picture-card">
        <li tabindex="0" class="el-upload-list__item is-success">
          <img :src="staff.displayPhoto" alt class="el-upload-list__item-thumbnail" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-delete">
              <i class="el-icon-delete" @click="deleteDisplayPhoto" />
            </span>
          </span>
        </li>
      </ul>
    </el-form-item>

    <el-form-item label="证件正面" prop="photoFront">
      <el-upload
        v-if="!staff.photoFront"
        list-type="picture-card"
        :show-file-list="false"
        :on-success="handlePhotoFrontSuccess"
        :on-remove="handlePhotoFrontRemove"
        :before-upload="beforeAvatarUpload"
        :action="action"
        :headers="headers"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <ul v-else class="el-upload-list el-upload-list--picture-card">
        <li tabindex="0" class="el-upload-list__item is-success">
          <img :src="staff.photoFront" alt class="el-upload-list__item-thumbnail" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-delete">
              <i class="el-icon-delete" @click="deleteFrontImg" />
            </span>
          </span>
        </li>
      </ul>
    </el-form-item>
    <el-form-item label="证件反面" prop="photoBack">
      <el-upload
        v-if="!staff.photoBack"
        list-type="picture-card"
        :show-file-list="false"
        :on-success="handlePhotoBackSuccess"
        :before-upload="beforeAvatarUpload"
        :action="action"
        :on-remove="handlePhotoBackRemove"
        :headers="headers"
      >
        <i class="el-icon-plus" />
      </el-upload>
      <ul v-else class="el-upload-list el-upload-list--picture-card">
        <li tabindex="0" class="el-upload-list__item is-success">
          <img :src="staff.photoBack" alt class="el-upload-list__item-thumbnail" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-delete">
              <i class="el-icon-delete" @click="deleteBackImg" />
            </span>
          </span>
        </li>
      </ul>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'BasicInfoForm',
  dicts: ['CREDENTIAL_TYPE'],
  props: ['staff'],
  data() {
    return {
      headers: undefined,
      action: '/end/file/upload/ftp',
      rules: {
        name: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        birthday: [
          { required: true, message: '请输入出生日期', trigger: 'blur' }
        ],
        credentialsType: [
          { required: true, message: '请选择证件类型', trigger: 'blur' }
        ],
        credentialsNo: [
          { required: true, message: '请输入证件号', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    photoFrontFile: function() {
      if (this.staff.photoFront) {
        return [{ name: '证件正面', url: this.staff.photoFront }]
      } else {
        return []
      }
    },
    photoBackFile: function() {
      if (this.staff.photoBack) {
        return [{ name: '证件反面', url: this.staff.photoBack }]
      } else {
        return []
      }
    },
    files: function() {
      return (this.staff.acc || []).map(file => {
        return { name: file.name, url: file.response.data }
      })
    }
  },
  methods: {
    deleteFrontImg() {
      this.staff.photoFront = ''
    },
    deleteDisplayPhoto() {
      this.staff.displayPhoto = ''
    },
    handlePhotoFrontRemove(file, fileList) {
      this.$emit('upload-success', { type: 'photoFront', fileList })
    },
    handlePhotoBackRemove(file, fileList) {
      this.$emit('upload-success', { type: 'photoBack', fileList })
    },
    handleDisplayPhotoRemove(file, fileList) {
      // this.$emit('upload-success', { type: 'photoBack', fileList })
      this.staff.displayPhoto = fileList
    },
    deleteBackImg() {
      this.staff.photoBack = ''
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG或者PNG 格式!')
      }
      return isJPG
    },
    handlePhotoFrontSuccess(res, file) {
      this.staff.photoFront = res.data
      // this.$emit('upload-success', { type: 'photoFront', fileList })
    },
    handlePhotoBackSuccess(res, file) {
      this.$forceUpdate()
      this.staff.photoBack = res.data
      // this.$emit('upload-success', { type: 'photoBack', fileList })
    },
    handleDisplayPhotoSuccess(res, file) {
      this.staff.displayPhoto = res.data
      // this.$emit('upload-success', { type: 'photoFront', fileList })
    },
    formValid() {
      let result = true
      this.$refs['form'].validate(valid => {
        if (!valid) {
          result = false
        }
      })
      return result
    }
  }
}
</script>

<style></style>
