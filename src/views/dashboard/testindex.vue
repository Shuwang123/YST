<template>
  <div class="site-content">
    挡泥板
    <!--<el-form :inline="true">-->
      <!--<com-store :paramsFather="{-->
        <!--'label_0': '',-->
        <!--'size_1': '',-->
        <!--'width_2': '180px',-->
        <!--'clear_3': false,-->
        <!--'multiple_4': false,-->
        <!--'must_5': true,-->
        <!--'isTrigger': true-->
      <!--}" ref="comStore" @eventStore="changeStoreData"></com-store>-->
    <!--</el-form>-->
  </div>
</template>
<script type="text/ecmascript-6">
import axios from 'axios'
// import ComStore from '../common/com-store'
export default {
  components: {
    // ComStore
  },
  name: 'testdashboard',
  data () {
    return {
      dataList: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    // cx新增，取了个巧，所有账号都会先进入这个页面，触发comStore，不然如果第一次进入有comstore的其他页面是没有手选门店初始值的
    // changeStoreData (choseStoreId) {
    //   // this.dataForm.storeId = choseStoreId
    // },
    getList () {
      /* const that = this */
      axios.get('../static/data/data.json').then((response) => {
        this.dataList = response.data.menuList
        if (this.dataList) {
          var data = this.dataList
          // console.log(data)
          function toTree (data) {
            // 删除所有children,以防止多次调用
            data.forEach(function (item) {
              delete item.children
            })
            // 将数据存储为以menuId为KEY的map索引数据列
            var map = {}
            data.forEach(function (item) {
              map[item.menuId] = item
            })
            // console.log(map)
            var val = []
            data.forEach(function (item) {
              // 以当前遍历项，的parentId,去map对象中找到索引的menuId
              var parent = map[item.parentId]
              // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
              if (parent) {
                (parent.children || (parent.children = [])).push(item)
              } else {
                // 如果没有在map中找到对应的索引menuId,那么直接把 当前的item添加到 val结果集中，作为顶级
                val.push(item)
              }
            })
            return val
          }
          this.store = toTree(data)
          console.log(this.store)
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
