<template>
  <div class="login" :style="backgroundDiv">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
      label-width="0px"
      class="login-form"
    >
      <h3 class="titleLogin">合同系统</h3>
      <el-form-item prop="userName">
        <el-input
          class="placeSty"
          v-model="loginForm.userName"
          type="text"
          auto-complete="off"
          placeholder="请输入用户名"
        >
          <svg-icon slot="prefix" icon-class="user2" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          class="placeSty"
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="请输入用户密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password2" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { encryptDes } from '@/utils/des'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        userName: '',
        password: '',
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' },
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
        ],
      },
      loading: false,
      redirect: undefined,
      backgroundDiv: {
        backgroundImage:
          'url(' + require('../assets/images/new_background.jpg') + ')',
      },
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        const user = {
          userName: this.loginForm.userName,
          password: encryptDes(this.loginForm.password, 'wxCloud123'),
        }
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', user)
            .then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  background-size: cover;
}
.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.titleLogin {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #ffffff;
}

.login-form {
  border-radius: 6px;
  background: #0e4281;
  width: 385px;
  padding: 50px;
  margin-right: 150px;
  .el-input {
    height: 38px;
    input {
      background-color: transparent;
      border-color: #116fb1 #116fb1 #116fb1 #116fb1;
      color: #15b3fe;
      height: 38px;
      padding-left: 40px;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
  }
  .input-icon {
    height: 39px;
    width: 18px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-form-item--small .el-form-item__content {
  margin-top: 5px;
}

.placeSty ::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #15b3fe !important;
  font-size: 12px !important;
}
/*:-moz-placeholder { !* Mozilla Firefox 4 to 18 *!*/
/*color: #15B3FE !important;*/
/*font-size: 12px !important;*/
/*}*/
/*::-moz-placeholder { !* Mozilla Firefox 19+ *!*/
/*color: #15B3FE !important;*/
/*font-size: 12px !important;*/
/*}*/
/*:-ms-input-placeholder { !* Internet Explorer 10+ *!*/
/*color: #15B3FE !important;*/
/*font-size: 12px !important;*/
/*}*/
</style>
