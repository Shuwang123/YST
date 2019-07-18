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
              <img src="~@/assets/img/avatar.png" :alt="$store.state.user.name" class="zhuanzhuanzhuan">
              <!--{{$store.state.user.name}}-->
              {{$store.getters.getAccountLoginInfoAll.NickName}}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>

    </div>
     <!--弹窗, 修改密码-->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </header>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import UpdatePassword from './update-password'
import { mapMutations } from 'vuex'
import {removeStore, removeAccountData} from '@/utils'
export default {
  data () {
    return {
      updatePassowrdVisible: false
    }
  },
  components: {
    UpdatePassword
  },
  methods: {
    // 切换侧边栏, 水平折叠收起状态
    switchSidebarCollapseHandle () {
      this.SWITCH_SIDEBAR_COLLAPSE({ collapse: !this.$store.state.sidebarCollapse })
    },
    // 修改密码
    updatePasswordHandle () {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    // 退出
    logoutHandle () {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.common.logout().then((data) => {
          if (data.code === '0000') {
            this.DELETE_CONTENT_TABS([])
            removeStore('userInfo')
            // 2019.5.8 cx新增移除登陆账号的三个信息：账号详情+账号是否是医生类型+账号当前锁定的手选门店
            // (本来的确是三个的)，但后来发现只需要移除当前锁定的手选门店字段，其他两个在登陆时会用覆盖的方式解决，想了解去(login/first-tab-add-or-update-flowing.vue)看代码
            // 并且还发现这儿就算把session删了，还是没达到目的，因为session是手工删除了，但其实退出操作时浏览器实际上并没有关闭的，导致你的Vuex并没有销毁，所以Vuex也要处理掉
            // removeAccountData('accountCurrentHandleStore') 后来发现自己的代码结构太优秀，连这句都可以省了
            this.$store.commit('setAccountCurrentHandleStore', null)
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
