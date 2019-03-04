<template>
  <aside class="site-sidebar">
    <div class="logo">
      <div class="over">
        <div class="logo_background"></div>
      </div>
      <div class="logo_child">
        <div class="logo_text">
          <img src="./bg.png" width="70" height="70" style="border-radius: 100%">
          <p>善郎中</p>
        </div>
      </div>
    </div>
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuNavActive"
        :collapse="$store.state.sidebarCollapse"
        class="site-sidebar__menu"
        background-color="rgba(0,0,0,0)"
        text-color="#fff"
        active-text-color="#ffd04b">
        <!--background-color="#545c64"-->
        <sub-menu-nav
          v-for="menuNav in $store.state.menuNavList"
          :key="menuNav.menuId"
          :menu-nav="menuNav">
        </sub-menu-nav>
      </el-menu>
    </div>
    <div class="sy">
    </div>
  </aside>
</template>
<script type="text/ecmascript-6">
import SubMenuNav from '@/components/sub-menu-nav'
import {mapMutations} from 'vuex'
import isEmpty from 'lodash/isEmpty'
import {getStore, treeDataTranslate} from '@/utils'
import API from '@/api'
export default {
  components: {
    SubMenuNav
  },
  watch: {
    $route: 'routeHandle'
  },
  data () {
    return {
      menuNavActive: '1-1',
      menudash: {
        'menuId': '1-1',
        'parentId': 0,
        'parentName': null,
        'name': '首页',
        'url': '/dashboard',
        'perms': null,
        'type': 1,
        'icon': 'icon-custom-shouye',
        'orderNum': 0,
        'open': null,
        'children': []
      },
      menuList: []
    }
  },
  created () {
  },
  mounted () {
    var userInfo = JSON.parse(getStore('userInfo'))
    this.menuList = treeDataTranslate(userInfo.menuList, 'menuId')
    console.log(this.menuList)
    this.menuList.sort((a, b) => {
      return a.orderNum - b.orderNum
    })
    this.menuList.forEach(item => {
      if (item.children && item.children.length > 0) {
        item.children.sort((a, b) => {
          return a.orderNum - b.orderNum
        })
      }
    })
    this.menuList.unshift(this.menudash)
    this.UPDATE_MENU_NAV_LIST(this.menuList)
    this.routeHandle(this.$route)
  },
  methods: {
    // 路由操作
    routeHandle (route) {
      if (route.path) {
        var tab = this.$store.state.contentTabs.filter(item => item.name === route.name)[0]

        // tab不存在, 先添加
        if (isEmpty(tab)) {
          var menuNav = this.getMenuNavByRouteName(route.path, this.$store.state.menuNavList)
          if (!isEmpty(menuNav)) {
            tab = {
              id: menuNav.menuId,
              name: route.name,
              isNew: true,
              title: menuNav.name,
              type: menuNav.type === 1 ? 'module' : 'iframe',
              url: menuNav.url,
              iframurl: menuNav.iframurl
            }
            this.ADD_CONTENT_TAB(tab)
          }
        } else {
          tab = Object.assign({}, tab)
          tab.isNew = false
        }
        this.menuNavActive = tab.id + ''
        this.UPDATE_CONTENT_TABS_ACTIVE_NAME({ name: route.name })
        this.UPDATE_CONTENT_TABS_ACTIVE(tab)
      }
    },
    // 获取菜单导航, 根据路由名称
    getMenuNavByRouteName (name, menuNavList) {
      for (var i = 0; i < menuNavList.length; i++) {
        if (menuNavList[i].children && menuNavList[i].children.length >= 1) {
          for (var j = 0; j < menuNavList[i].children.length; j++) {
            if (menuNavList[i].children[j].url === name) {
              return menuNavList[i].children[j]
            }
          }
        } else {
          if (menuNavList[i].url === name) {
            return menuNavList[i]
          }
        }
      }
    },
    ...mapMutations(['UPDATE_MENU_NAV_LIST', 'ADD_CONTENT_TAB', 'UPDATE_CONTENT_TABS_ACTIVE_NAME', 'UPDATE_CONTENT_TABS_ACTIVE'])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.site-sidebar {
  /*height: 100%;
  overflow: hidden;
  & .site-sidebar__inner {
    background-color: rgba(0,0,0,0.8);
  }
  & .sy {
    position: absolute;
    top: 0;bottom: 0;right: 0;left: 0;
    background-image: url("./bg.png");
    filter: blur(20px);
    z-index: -1;
  }*/
  & .logo {
    height: 170px;
    & .over{
      overflow: hidden;
      height: 160px;
      .logo_background {
        float: left;
        width: 230px; height: 160px;
        background-image: url("./bg.png");
        filter: blur(9px);
        z-index: -1;
      }
    }
    & .logo_child {
      position: absolute;
      left: 0;top: 0;
      width: 230px; height: 160px;
      background-color: rgba(84,92,100,.9);
      & .logo_text {
        padding-top: 30px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        & p {padding-top: 10px}
      }
    }
  }
}

</style>
