<!--import ComStore from '../common/com-store'-->

<!--调用方式<com-store :paramsFather="{-->
<!--'label_0': '',-->
<!--'size_1': '',-->
<!--'width_2': '180px',-->
<!--'clear_3': true,-->
<!--'disabled_4': false, 废弃-->
<!--'multiple_4': false-->
<!--'must_5': false 新增 isTrigger: true 是否在在某个地方切换门店后，触发全局的当前手选门店项字段更新-->
<!--}" ref="comStore" @eventStore="changeStoreData"></com-store>-->

<!--changeStoreData (choseStoreId) {-->
<!--this.dataForm.storeId = choseStoreId-->
<!--// console.log(this.dataForm.storeId)-->
<!--},-->

<!--2019.5.5 再次优化组件，添加字段 must_5 ，判断下拉是否有默认的必须的初始下拉值-->
<!--2019.5.5 同时废弃此字段 :disabled="paramsFather.disabled_4" -->
<template>
  <el-form-item :label="paramsFather.label_0" prop="storeArr">
    <el-select v-model="StoreId" placeholder="请选择门店"
      :size="paramsFather.size_1"
      :style="{width: paramsFather.width_2}"
      :clearable="paramsFather.clear_3"
      :multiple="paramsFather.multiple_4">
      <el-option
        v-for="item in storeArr" :key="item.Id"
        :label="'['+item.Id+'] '+item.Name" :value="item.Id"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import API from '@/api'
export default {
  data () {
    return {
      storeArr: [],
      StoreId: '' // 传给父级，有可能多选
    }
  },
  props: ['paramsFather'], //
  created () {
    this.getStoreArrInit() // 门店子组件加载时，先正确的把下拉内容option处理了
  },
  watch: {
    StoreId (val, oldval) { // 第二个参数true和false判断返回是多选,还是单选值
      console.log(val)
      // 当前手选门店时，这个也是true的话，就会更新全局的当前选中门店字段【这个字段是在入库单列表往后开始出现的】(先存给Vuex，后在Vuex的commit中存给store，同时转存给session)
      if (this.paramsFather.isTrigger === true) {
        this.$store.commit('setAccountCurrentHandleStore', val)
      }
      if (this.paramsFather.multiple_4 === true) {
        this.$emit('eventStore', val.join(), true)
      } else {
        this.$emit('eventStore', val, false)
      }
    }
  },
  methods: {
    getStoreArrInit () {
      this.$nextTick(() => {
        API.store.storeAll({ // 在总门店表中请求出当前账号对应自己门店
          name: '',
          code: '',
          pageIndex: 1,
          pageSize: 1000, // 不会有那么多，取个巧
          isPaging: true,
          canViewStores: this.$store.getters.getAccountLoginInfoAll.CanViewStores // 传递 '' 是返回全部？忘了……
        }).then(response => {
          if (response.code === '0000') {
            this.storeArr = response.data
          }
          // 以下分支必须要父组件确认自己为必选且默选时才调用Vuex当前选中项，如果是edit类型的这段代码不符合要求
          if (this.paramsFather.must_5 === true) { // 2019.5.5 cx新增字段，用于判断是否需要默认值
            this.StoreId =
              this.$store.getters.getAccountCurrentHandleStore === null ? (this.$store.getters.getAccountLoginInfoAll.StoreId === 0 ? response.data[0].Id : this.$store.getters.getAccountLoginInfoAll.StoreId) : this.$store.getters.getAccountCurrentHandleStore
          }
        })
      })
    },
    // 此方法针对父组件edit类型打开comStore时，初始化门店默认下拉的选中项,
    // 在这初始化(只针对edit类型搭配comstore组件时)
    // 比如账号界面，编辑账号的可控门店，edit后有个初始化选择的
    // this.$nextTick(() => {
    //   this.$refs.comStoreOne.pageInit('')
    //   this.$refs.comStoreSome.pageInit([]) // 多选的时候清空子组件不要传''了，不然子组件后续的选择调用push方法时有bug，而且你还找不出来，恶心死人
    // })
    pageInit (StoreId) {
      this.StoreId = StoreId
    }
  }
}
</script>
<style scoped>
.mod-drugs[data-v-1e1a4cc4] .el-form-item {
  margin-bottom: 0;
}
</style>
<!--// 清空子组件选择记录，针对某些情况下父组件关闭了自己的弹窗，但是这儿的数据还保存有之前的一些选择-->
<!--// clearChild () {-->
<!--//   this.loginInfo = null-->
<!--//   this.storeArr = []-->
<!--//   this.StoreId = ''-->
<!--// }-->
