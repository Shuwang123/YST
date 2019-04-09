<template>
  <div class="site-wrapper"
       :class="siteWarpperClasses"
       v-loading.fullscreen.lock="loading"
       element-loading-text="拼命加载中">
    <template v-if="!loading">
      <topbar></topbar>
      <sidebar></sidebar>
      <div class="site-content__wrapper" :style="siteContentWarpperStyles">
        <content-tabs></content-tabs>
        <transition mode="out-in">
          <iframe v-if="$store.state.contentAcitveTab.type=='iframe'" :src="$store.state.contentAcitveTab.iframurl" width="100%" height="100%" frameborder="0" scrolling="yes">
          </iframe>
          <router-view v-else></router-view>
        </transition>
        <!--路由不刷新-->
        <!--<keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>-->
        <!--路由不刷新-->
      </div>
    </template>
  </div>
</template>
<script type="text/ecmascript-6">
import API  from '@/api'
import Topbar from './topbar'
import Sidebar from './sidebar'
import ContentTabs from './content-tabs'
import { mapMutations, mapGetters } from 'vuex'
import { getStore} from '@/utils'
export default {
  components: {
    Topbar,
    Sidebar,
    ContentTabs
  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
    this.resetDocumentClientHeight()
    window.onresize = () => {
      this.resetDocumentClientHeight()
    }
    var userInfo = JSON.parse(getStore('userInfo'))
    var users = userInfo.account
    this.UPDATE_USER_NAME({'name': users.username})
    this.UPDATE_USER_ID({'id': users.id})
  },
  computed: {
    siteWarpperClasses () {
      return [
        { 'site-sidebar--collapse': this.$store.state.sidebarCollapse }
      ]
    },
    siteContentWarpperStyles () {
      if (this.$store.state.contentAcitveTab.type === 'iframe') {
        return [{ 'height': this.$store.state.documentClientHeight + 'px' }]
      } else {
        return [{ 'minHeight': this.$store.state.documentClientHeight + 'px' }]
      }
    }
  },
  methods: {
    // 重置窗口可视高度
    resetDocumentClientHeight () {
      this.UPDATE_DOCUMENT_CLIENT_HEIGHT({ height: document.documentElement['clientHeight'] - 10 })
      var iframeHight = document.documentElement['clientHeight'] - 240
      this.$store.dispatch('setUPDATE_DOCUMENT_CLIENT_IFRAME', iframeHight)
      this.UPDATE_DOCUMENT_CLIENT_IFRAME({height: (document.documentElement['clientHeight'] - 240)})
    },
    ...mapMutations(['UPDATE_DOCUMENT_CLIENT_HEIGHT', 'UPDATE_DOCUMENT_CLIENT_IFRAME', 'UPDATE_USER_NAME', 'UPDATE_USER_ID'])
  }
}
</script>

<!--chenxi 新增-->
<style rel="stylesheet/scss" lang="scss" scoped>
.v-enter {
  opacity: 0;
  transform: translateX(-10%);
}
.v-enter-active,
.v-leave-active {
  transition: all .6s ease;
}
.v-leave-to {
  opacity: 0;
  transform: translateX(10%);
  position: fixed; /*搞不懂为啥子absolute就不行了，absolute必须搭配-10%和-10%，两个都必须是-，有一个正的就罢工； 其实absolute的时候某一部分页面可行，貌似和页面之间的高度有关，height小于等于100%？*/
}
</style>
