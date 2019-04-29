<template>
    <div class="mod-storeRegister">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <div style="background-color: #F5F7FA;margin-bottom: 0;border-radius: 0 0 0 0;padding: 1px 3px">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="mini">
          <el-row style="height: 35px;line-height: 35px">
            <el-col :span="21">
              <com-store :paramsFather="{
                'label_0': '',
                'size_1': 'mini',
                'width_2': '120px',
                'clear_3': false,
                'disabled_4': !dataForm.View,
                'multiple_5': false
              }" ref="comStoreOne" @eventStore="changeStoreData"></com-store>
              <el-form-item>
                <el-input v-model="dataForm.MobilePhone" placeholder="医生" clearable style="width: 70px"></el-input>
              </el-form-item>
              <span>
                <el-form-item>
                <el-input v-model="dataForm.MobilePhone" placeholder="患者" clearable style="width: 70px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input v-model="dataForm.MobilePhone" placeholder="患者电话" clearable style="width: 119px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-date-picker
                  size="mini"
                  v-model="value6"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width: 260px">
                </el-date-picker>
              </el-form-item>
              </span>
              <el-form-item>
                <el-button
                  @click="isVisible[0].child ===  true ? $refs.firstTab.getDataList() : $refs.secondTab.getDataList()"
                  size="mini">查询
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: right;padding-right: 10px">
              <el-button  type="primary" @click="$router.push(`/doctor/treatment`)" size="mini">辅助开方</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-tab-pane label="" name="first">
        <span slot="label"><i class="el-icon-upload"></i> 挂号</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[0].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="second">
        <span slot="label"><i class=""></i> 挂号列表</span>
        <transition name="chenxi">
          <second-tab v-if="isVisible[1].child" ref="secondTab" :fatherDataForm="dataForm"></second-tab>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTab from './first-tab'
import SecondTab from './second-tab'
import ComStore from '../common/com-store'
export default {
  watch: {
    'value6': function () {
      console.log(this.value6)
      if (this.value6 !== [] && this.value6 !== null) {
        this.dataForm.StartDate = this.value6[0]
        this.dataForm.EndDate = this.value6[1]
        // console.log(this.dataForm.StartDate)
        // console.log(this.dataForm.EndDate)
      } else {
        this.dataForm.StartDate = ''
        this.dataForm.EndDate = ''
      }
    }
  },
  data () {
    return {
      activeName: 'first',
      drugsCategoryList: [],
      dataForm: { // 三个子组件共有的查询条件：门店，商品编码、商品名称、商品拼音
        StoreId: '',
        View: true, // 是否显示门店筛选组件
        StartDate: '',
        EndDate: ''
      },
      isVisible: [
        {child: true},
        {child: false},
        {child: false}
      ],
      value6: []
    }
  },
  components: {
    ComStore,
    FirstTab,
    SecondTab
  },
  created () {
    this.pageInit() // 初始化门店列表
  },
  methods: {
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      if (isMultiple === false) {
        this.dataForm.StoreId = choseStoreId
        if (this.isVisible[0].child === true) {
          this.$refs.firstTab.getDataList()
        } else {
          this.$refs.secondTab.getDataList()
        }
      }
    },
    pageInit () {
      this.$nextTick(() => {
        API.purchase.getLoginInfo().then(result => {
          if (result.code === '0000') {
            this.dataForm.UserName = result.data.UserName
            this.dataForm.View = result.data.View // 决定门店下拉禁用
            console.log(result.data)
            if (result.data.View === false) {
              this.$refs.comStoreOne.pageInit(result.data.StoreId) // 单选类型，多选类型，初始化下拉值
              // 下面这个API，只是因为loginInfo这个无法直接拿到contact等信息，不得不重新请求另一个接口而已
              API.store.storeAll({
                name: '',
                PageIndex: 1,
                PageSize: 1000,
                IsPaging: true,
                code: '',
                canViewStores: result.data.CanViewStores
              }).then(result => {
                if (result.code === '0000') {
                  this.dataForm.StoreId = result.data[0].Id
                  this.dataForm.StoreCode = result.data[0].Code
                  this.dataForm.Buyer = result.data[0].Contact
                  this.dataForm.Phone = result.data[0].Phone
                  this.dataForm.Address = result.data[0].Address
                }
                console.log(this.dataForm.StoreId)
                this.$refs.firstTab.getDataList()
              })
            } else {
              API.store.storeAll({
                name: '',
                PageIndex: 1,
                PageSize: 1000,
                IsPaging: true,
                code: '',
                canViewStores: ''
              }).then(result => {
                if (result.code === '0000') {
                  this.dataForm.StoreId = result.data[0].Id
                  this.dataForm.StoreCode = result.data[0].Code
                  this.dataForm.Buyer = result.data[0].Contact
                  this.dataForm.Phone = result.data[0].Phone
                  this.dataForm.Address = result.data[0].Address
                }
                this.$refs.comStoreOne.pageInit(this.dataForm.StoreId)
                this.$refs.firstTab.getDataList()
                console.log(this.dataForm.StoreId)
              })
            }
          }
        })
      })
    },
    handleClick (tab, event) {
      switch (tab.name) {
        case 'first':
          this.isVisible = this.isVisible.map((item, index) => {
            return index === 0 ? {child: true} : {child: false}
          })
          break
        case 'second':
          this.isVisible = this.isVisible.map((item, index) => {
            return index === 1 ? {child: true} : {child: false}
          })
          break
      }
      this.$nextTick(() => {
        this.isVisible.forEach((item, index) => {
          if (item.child === true) {
            if (index === 0) {
              this.num = 0
              this.$refs.firstTab.getDataList()
            } else if (index === 1) {
              this.num = 1
              this.$refs.secondTab.getDataList() // 挂号列表
            }
            return false
          }
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/*vue过渡初次尝试*/
.chenxi-enter {
  transform: translate(40px, 30px);
  opacity: 0;
}
/*.chenxi-enter-to, .chenxi-leave {
transform: translate(0, 0);
opacity: 1;
}*/
.chenxi-enter-active,
.chenxi-leave-active {
  transition: all 0.6s ease;
}
/*.chenxi-leave-to {
  transform: translateX(-100px, 0);
}*/

.mod {
  &-storeRegister /deep/ {
    margin-left: 10px;
    /*max-height: 810px;*/
    overflow: hidden;
    .el-pagination {
      margin-top: 15px;
      text-align: left;
    }
    .nav{
      position: absolute;
      width: 100%;
    }
  }
}
/*以下样式cx重写的，改变form中内部控件的行间距等默认22px太高*/
.mod-storeRegister{
  & /deep/ .el-form-item {
    margin-bottom: 0px;
  }
  & /deep/ .el-dialog__body {
    padding-top: 10px;
  }
  /*表头高重写35高*/
  & /deep/ .el-table--medium th, & /deep/ .el-table--medium td, & /deep/ .el-table th, & /deep/ .el-table td,
  & /deep/ .el-table--medium th, & /deep/ .el-table--medium td, & /deep/ .el-table th, & /deep/ .el-table td {
    padding: 0 !important;
  }
  /*& /deep/ .el-tabs__content {background-color: #F0F0F0}*/
  & /deep/ .storeStockListRow {
    color: #606266;
    & td {padding: 0;}
    & td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
}
/*.mod-purchaseList {*/
  /*& /deep/ .el-dialog__header {*/
    /*background-color: #1CA579;*/
  /*}*/
/*}*/
</style>
