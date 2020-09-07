<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">

        <el-tooltip content="大屏展示" effect="dark" placement="bottom">
          <dashboardIcon id="dashboard" class="right-menu-item hover-effect"  />
        </el-tooltip>

        <el-tooltip content="全屏缩放" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="布局设置" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="Avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <span style="display:block;" >
            <el-dropdown-item >
              {{trueName}}
            </el-dropdown-item>
          </span>
          <span style="display:block;" @click="show = true">
            <el-dropdown-item divided>
              布局设置
            </el-dropdown-item>
          </span>
          <span style="display:block;" @click="showPasswordDialog">
            <el-dropdown-item>
              修改密码
            </el-dropdown-item>
          </span>
          <span style="display:block;" @click="open">
            <el-dropdown-item>
              退出登录
            </el-dropdown-item>
          </span>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogPasswordVisible" :modal-append-to-body="false">
      <el-form ref="updatePassForm" :rules="rules" :model="updatePassForm" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="updatePassForm.oldPassword" placeholder="请输入原密码" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="updatePassForm.newPassword" placeholder="请输入新密码" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPasswordVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import dashboardIcon from '@/components/dashboard'
import Avatar from '@/assets/images/avatar.png'
import { updatePassword } from '@/api/system/user'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    dashboardIcon
  },
  data() {
    return {
      Avatar: Avatar,
      dialogVisible: false,
      dialogPasswordVisible: false,
      updatePassForm: {},
      rules: {
        oldPassword: [{ required: true, message: '请填写密码', trigger: 'blur' }, { min: 6, message: '长度至少6个字符', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请填写密码', trigger: 'blur' }, { min: 6, message: '长度至少6个字符', trigger: 'blur' }]
      },
      trueName:JSON.parse(sessionStorage.getItem('user')).trueName
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
      'user',
      'baseApi'
    ]),
    show: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    showPasswordDialog() {
      this.$nextTick(() => {
        this.dialogPasswordVisible = true
      })
    },
    changePassword() {
      updatePassword(this.updatePassForm).then((res) => {
        this.dialogPasswordVisible = false
        this.$notify({
          title: '密码修改成功，请重新登录',
          type: 'success',
          duration: 1500
        })
        setTimeout(() => {
          this.logout()
        }, 1500)
      })
    },
    open() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
