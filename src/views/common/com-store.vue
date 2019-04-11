<!--import ComStore from '../common/com-store'-->

<!--调用方式<com-store :paramsFather="{-->
<!--'label_0': '',-->
<!--'size_1': '',-->
<!--'width_2': '180px',-->
<!--'clear_3': true,-->
<!--'disabled_4': false,-->
<!--'multiple_5': false-->
<!--}" ref="comStore" @eventStore="changeStoreData"></com-store>-->

<!--changeStoreData (choseStoreId) {-->
<!--this.dataForm.storeId = choseStoreId-->
<!--// console.log(this.dataForm.storeId)-->
<!--},-->
<template>
  <el-form-item :label="paramsFather.label_0" prop="storeArr">
    <el-select v-model="storeId" placeholder="请选择门店" @change="handleChange"
      :size="paramsFather.size_1"
      :style="{width: paramsFather.width_2}"
      :clearable="paramsFather.clear_3"
      :disabled="paramsFather.disabled_4"
      :multiple="paramsFather.multiple_5">
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
      loginInfo: null,
      storeArr: [],
      storeId: '' // 传给父级，有可能多选
    }
  },
  props: ['paramsFather'], //
  created () {
    this.getStoreArrInit()
  },
  methods: {
    // 比如账号界面，编辑账号的可控门店，edit后有个初始化选择的
    // this.$nextTick(() => {
    //   this.$refs.comStoreOne.pageInit('')
    //   this.$refs.comStoreSome.pageInit([]) // 多选的时候清空子组件不要传''了，不然子组件后续的选择调用push方法时有bug，而且你还找不出来，恶心死人
    // })
    pageInit (storeId) {
      this.storeId = storeId
      // console.log(this.storeId)
    },
    getStoreArrInit () {
      API.purchase.getLoginInfo().then(result => {
        if (result.code === '0000') {
          this.loginInfo = result.data
          console.log(this.loginInfo)
          this.$nextTick(() => {
            API.store.storeAll({
              name: '',
              code: '',
              pageIndex: 1,
              pageSize: 1000,
              isPaging: true,
              canViewStores: this.loginInfo.CanViewStores //
            }).then(response => {
              if (response.code === '0000') {
                this.storeArr = response.data
              }
            })
          })
        }
      })
    },
    handleChange (val) {
      console.log(val)
      // 把选择的门店的详情id等处理后，给父组件使用，因为有时候可能设计到多选门店(不是所有情况都只选单个门店)
      // 第二个参数true和false用于父组件判断，返回的是多选类型的值还是单选类型的值
      if (this.paramsFather.multiple_5 === true) {
        this.$emit('eventStore', val.join(), true)
      } else {
        this.$emit('eventStore', val, false)
      }
    }
    // 清空子组件选择记录，针对某些情况下父组件关闭了自己的弹窗，但是这儿的数据还保存有之前的一些选择
    // clearChild () {
    //   this.loginInfo = null
    //   this.storeArr = []
    //   this.storeId = ''
    // }
  }
}
</script>

<style scoped>

</style>
