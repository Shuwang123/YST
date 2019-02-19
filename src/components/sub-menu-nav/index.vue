<template>
  <el-submenu
    v-if="menuNav.children && menuNav.children.length >= 1"
    :data-idx="menuNav.menuId + ''"
    :index="menuNav.menuId + ''">
    <template slot="title">
      <i :class="['site-sidebar__menu-icon', menuNav.icon ? menuNav.icon : 'icon-custom-shouye']"></i>
      <span>{{ menuNav.name }}</span>
    </template>
    <sub-menu-nav
      v-for="item in menuNav.children"
      :key="item.menuId"
      :menu-nav="item">
    </sub-menu-nav>
  </el-submenu>
  <el-menu-item
    v-else
    :index="menuNav.menuId + ''"
    :data-idx="menuNav.menuId + ''"
    @click="gotoRouteHandle(menuNav.url)">
    <i :class="['site-sidebar__menu-icon', menuNav.icon ? menuNav.icon : 'icon-custom-shouye']"></i>
    <span>{{ menuNav.name }}</span>
  </el-menu-item>
</template>

<script>
  import SubMenuNav from '../sub-menu-nav'
  export default {
    name: 'sub-menu-nav',
    props: {
      menuNav: Object,
      required: true
    },
    components: {
      SubMenuNav
    },
    methods: {
      // 跳转到菜单导航对应路由
      gotoRouteHandle (url) {
        console.log(this.menuNav.name);
        if (/\S/.test(url)) {
          this.$router.push({ path: url })
        }
      }
    }
  }
</script>
