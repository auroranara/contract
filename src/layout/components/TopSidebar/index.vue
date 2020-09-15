<template>
  <div class="top-menu">
    <el-menu
      mode="horizontal"
      :unique-opened="true"
      @select="handleSelect"
      :collapse-transition="false"
      background-color="#BBBBBB"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-submenu index="grgzt" :popper-append-to-body="false">
        <template slot="title">个人工作台</template>
        <el-menu-item index="dbsx">待办事项</el-menu-item>
        <el-menu-item index="ybsx">已办事项</el-menu-item>
        <el-menu-item index="dysx">待阅事项</el-menu-item>
        <el-menu-item index="yysx">已阅事项</el-menu-item>
        <el-menu-item index="wdht">我的合同</el-menu-item>
      </el-submenu>
      <el-submenu index="htch" :popper-append-to-body="false">
        <template slot="title">合同策划</template>
        <el-submenu index="htchqdd" :popper-append-to-body="false">
          <template slot="title">合同策划启动单</template>
          <el-menu-item index="htchqdd-add">新增序时簿</el-menu-item>
          <el-menu-item index="htchqdd-adjust">调整序时簿</el-menu-item>
        </el-submenu>
        <el-submenu index="htchd" :popper-append-to-body="false">
          <template slot="title">合同策划单</template>
          <el-menu-item index="htchd-add">新增序时簿</el-menu-item>
          <el-menu-item index="htchd-adjust">调整序时簿</el-menu-item>
        </el-submenu>
        <el-submenu index="htchhzd" :popper-append-to-body="false">
          <template slot="title">合同策划汇总单</template>
          <el-menu-item index="htchhzd-add">新增序时簿</el-menu-item>
          <el-menu-item index="htchhzd-adjust">调整序时簿</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="zbjh" :popper-append-to-body="false">
        <template slot="title">招标计划</template>
        <el-submenu index="zbgl1" :popper-append-to-body="false">
          <template slot="title">年度招标计划启动单</template>
          <el-menu-item index="zbgl1-add">新增序时簿</el-menu-item>
          <el-menu-item index="zbgl1-adjust">调整序时簿</el-menu-item>
        </el-submenu>
        <el-submenu index="zbjhd" :popper-append-to-body="false">
          <template slot="title">招标计划单</template>
          <el-menu-item index="zbjhd-add">新增序时簿</el-menu-item>
          <el-menu-item index="zbjhd-adjust">调整序时簿</el-menu-item>
        </el-submenu>
        <el-submenu index="zbjhhzd" :popper-append-to-body="false">
          <template slot="title">招标计划汇总单</template>
          <el-menu-item index="zbjhhzd-add">新增序时簿</el-menu-item>
          <el-menu-item index="zbjhhzd-adjust">调整序时簿</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="zbtp" :popper-append-to-body="false">
        <template slot="title">招标谈判</template>
        <el-submenu index="zbwjbz">
          <template slot="title">文件编制</template>
          <el-submenu index="zbwjbz-zbwjbz" :popper-append-to-body="false">
            <template slot="title">招标文件编制</template>
            <el-menu-item index="zbwjbz-zbwjbz-add">新增序时簿</el-menu-item>
            <el-menu-item index="zbwjbz-zbwjbz-adjust">调整序时簿</el-menu-item>
          </el-submenu>
          <el-submenu index="jzxtpwjbz" :popper-append-to-body="false">
            <template slot="title">竞争性谈判文件编制</template>
            <el-menu-item index="jzxtpwjbz-add">新增序时簿</el-menu-item>
            <el-menu-item index="jzxtpwjbz-adjust">调整序时簿</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="kzj" :popper-append-to-body="false">
          <template slot="title">控制价</template>
          <el-menu-item index="kzj-add">新增序时簿</el-menu-item>
          <el-menu-item index="kzj-adjust">调整序时簿</el-menu-item>
        </el-submenu>
        <el-submenu index="cglr" :popper-append-to-body="false">
          <template slot="title">成果录入</template>
          <el-submenu index="cglr-zbcg" :popper-append-to-body="false">
            <template slot="title">招标成果</template>
            <el-menu-item index="cglr-zbcg-add">新增序时簿</el-menu-item>
            <el-menu-item index="cglr-zbcg-adjust">调整序时簿</el-menu-item>
          </el-submenu>
          <el-submenu index="cglr-jzxtpcg" :popper-append-to-body="false">
            <template slot="title">竞争性谈判成果</template>
            <el-menu-item index="cglr-jzxtpcg-add">新增序时簿</el-menu-item>
            <el-menu-item index="cglr-jzxtpcg-adjust">调整序时簿</el-menu-item>
          </el-submenu>
          <el-submenu index="cglr-wttpcg" :popper-append-to-body="false">
            <template slot="title">委托谈判成果</template>
            <el-menu-item index="cglr-wttpcg-add">新增序时簿</el-menu-item>
            <el-menu-item index="cglr-wttpcg-adjust">调整序时簿</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-submenu>
      <el-submenu index="thqd" :popper-append-to-body="false">
        <template slot="title">合同签订</template>
        <el-submenu index="thqd-wjbz" :popper-append-to-body="false">
          <template slot="title">文件编制</template>
          <el-menu-item index="thqd-wjbz-add">新增序时簿</el-menu-item>
          <el-menu-item index="thqd-wjbz-adjust">调整序时簿</el-menu-item>
        </el-submenu>
        <el-submenu index="thqd-htwjqdqr" :popper-append-to-body="false">
          <template slot="title">合同文件签订确认</template>
          <el-menu-item index="thqd-htwjqdqr-add">新增序时簿</el-menu-item>
          <el-menu-item index="thqd-htwjqdqr-adjust">调整序时簿</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="htzx" :popper-append-to-body="false">
        <template slot="title">合同执行</template>
        <el-submenu index="skhtxx" :popper-append-to-body="false">
          <template slot="title">收款合同信息</template>
          <el-menu-item index="skhtxx-add">新增序时簿</el-menu-item>
          <el-menu-item index="skhtxx-adjust">调整序时簿</el-menu-item>
        </el-submenu>
        <el-submenu index="fkhtxx" :popper-append-to-body="false">
          <template slot="title">付款合同信息</template>
          <el-menu-item index="fkhtxx-add">新增序时簿</el-menu-item>
        </el-submenu>
        <el-submenu index="htxz" :popper-append-to-body="false">
          <template slot="title">合同修正</template>
          <el-submenu index="htxz-qdbx" :popper-append-to-body="false">
            <template slot="title">清单编修</template>
            <el-menu-item index="htxz-qdbx-add">新增序时簿</el-menu-item>
          </el-submenu>
          <el-submenu index="htxz-httz" :popper-append-to-body="false">
            <template slot="title">合同调整</template>
            <el-menu-item index="htxz-httz-add">新增序时簿</el-menu-item>
          </el-submenu>
          <el-submenu index="htxz-htbg" :popper-append-to-body="false">
            <template slot="title">合同变更</template>
            <el-menu-item index="htxz-htbg-add">新增序时簿</el-menu-item>
          </el-submenu>
          <el-submenu index="htxz-bcxy" :popper-append-to-body="false">
            <template slot="title">补充协议</template>
            <el-menu-item index="htxz-bcxy-add">新增序时簿</el-menu-item>
          </el-submenu>
          <el-submenu index="htxz-sltz" :popper-append-to-body="false">
            <template slot="title">税率调整</template>
            <el-menu-item index="htxz-sltz-add">新增序时簿</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-submenu index="htjl" :popper-append-to-body="false">
          <template slot="title">合同计量</template>
          <el-menu-item index="htjl-add">新增序时簿</el-menu-item>
          <el-menu-item index="htjl-adjust">调整序时簿</el-menu-item>
        </el-submenu>
        <el-submenu index="jltc" :popper-append-to-body="false">
          <template slot="title">计量调差</template>
          <el-menu-item index="jltc-add">新增序时簿</el-menu-item>
          <el-menu-item index="jltc-adjust">调整序时簿</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-submenu index="jsgb" :popper-append-to-body="false">
        <template slot="title">结算关闭</template>
        <el-submenu index="htjs" :popper-append-to-body="false">
          <template slot="title">合同结算</template>
          <el-menu-item index="htjs-add">新增序时簿</el-menu-item>
          <el-menu-item index="htjs-adjust">调整序时簿</el-menu-item>
        </el-submenu>
        <el-submenu index="htgb" :popper-append-to-body="false">
          <template slot="title">合同关闭</template>
          <el-menu-item index="htgb-add">新增序时簿</el-menu-item>
          <el-menu-item index="htgb-adjust">调整序时簿</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import variables from '@/assets/styles/variables.scss'

export default {
  name: 'TopSidbar',
  data() {
    return {}
  },
  computed: {
    variables() {
      return variables
    },
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
    padding: 0 10px;
    margin: 0 10px;
  }
  .el-submenu__title i {
    color: white;
  }
}
</style>
