<template>
  <header class="site-topbar">
    <!--<div class="site-topbar__header">-->
      <!--<h1 class="site-logo" @click="$router.push({ name: 'dashboard' })">-->
        <!--<a class="site-logo__lg" href="javascript:;">一善堂</a>-->
        <!--<a class="site-logo__mini" href="javascript:;">MPR-T</a>-->
      <!--</h1>-->
    <!--</div>-->
    <div class="site-topbar__body clearfix">
      <el-menu
        class="site-topbar__menu"
        mode="horizontal">
        <el-menu-item class="site-topbar__switch" index="1-1" @click="switchSidebarCollapseHandle()">
          <i class="icon-custom-nav"></i>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-topbar__menu site-topbar__menu--right"
        mode="horizontal">
        <el-menu-item class="site-topbar__avatar" index="1-2">
          <el-dropdown placement="bottom" :hide-on-click="false">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="$store.state.user.name" class="zhuanzhuanzhuan">{{$store.state.user.name}}
            </span>
            <el-dropdown-menu slot="dropdown">
              <!--<el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>-->
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!--&lt;!&ndash; 弹窗, 修改密码 &ndash;&gt;
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>-->
  </header>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
// import UpdatePassword from './update-password'
import { mapMutations } from 'vuex'
import {removeStore} from '@/utils'
export default {
  data () {
    return {
      // updatePassowrdVisible: false
    }
  },
  components: {
    // UpdatePassword
  },
  methods: {
    // 切换侧边栏, 水平折叠收起状态
    switchSidebarCollapseHandle () {
      this.SWITCH_SIDEBAR_COLLAPSE({ collapse: !this.$store.state.sidebarCollapse })
    },
    // 修改密码
    // updatePasswordHandle () {
    //   this.updatePassowrdVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.updatePassowrd.init()
    //   })
    // },
    // 退出
    logoutHandle () {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.common.logout().then((data) => {
          if (data && data.code === '200') {
            this.DELETE_CONTENT_TABS([])
            removeStore('userInfo')
            this.$router.replace({ name: 'login' })
          }
        })
      })
    },
    ...mapMutations(['SWITCH_SIDEBAR_COLLAPSE', 'DELETE_CONTENT_TABS'])
  }
}
</script>
<style type="text/css">
.zhuanzhuanzhuan:hover {
  transform: rotate(666turn);
  transition-duration: 59s;
  transition-timing-function: cubic-bezier(.34, 0, .84, 1)
}
</style>
