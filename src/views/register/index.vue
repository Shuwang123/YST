<template>
    <div class="mod-storeStock">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">

      <div style="background-color: #F5F7FA;margin-bottom: 0;border-radius: 0 0 0 0;padding: 1px 3px">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-row style="height: 35px;line-height: 35px">
            <el-col :span="12">
              对应门店：index页
              <!--<com-store style="vertical-align: middle" :paramsFather="{-->
                <!--'label_0': '',-->
                <!--'size_1': 'small',-->
                <!--'width_2': '120px',-->
                <!--'clear_3': true,-->
                <!--'disabled_4': false,-->
                <!--'multiple_5': false-->
              <!--}" ref="comStoreOne" @eventStore="changeStoreData"></com-store>-->
            </el-col>
            <el-col :span="12" style="text-align: right;padding-right: 10px">
              <el-button  type="primary" @click="$router.push(`/doctor/treatment`)" size="mini">辅助医生开方</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!--<el-tab-pane label="成品药品" name="second" disabled="true">-->
      <el-tab-pane label="" name="first">
        <span slot="label"><i class="el-icon-upload"></i> 挂号</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[0].child"  :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="second">
        <span slot="label"><i class=""></i> 挂号列表</span>
        <transition name="chenxi">
          <second-tab v-if="isVisible[1].child" :fatherDataForm="dataForm"></second-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="third">
        <span slot="label"><i class=""></i> xx</span>
        <transition name="chenxi">
          <third-tab v-if="isVisible[2].child" ref="firstTab" :fatherDataForm="dataForm"></third-tab>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTab from './first-tab'
import SecondTab from './second-tab'
import ThirdTab from './third-tab'
import ComStore from '../common/com-store'
export default {
  data () {
    return {
      activeName: 'first',
      // SupplierIdArr: [], // 先请求供应商数组
      drugsCategoryList: [],

      dataForm: { // 三个子组件共有的查询条件：门店，商品编码、商品名称、商品拼音
        StoreId: '',
        CategoryText: '',
        CategoryId: '',
        ProductCodeOrBarCode: '',
        ProductName: '',
        SpellName: ''
      },
      isVisible: [
        {child: true},
        {child: false},
        {child: false}
      ]
    }
  },
  components: {
    FirstTab,
    SecondTab,
    ThirdTab,
    ComStore
  },
  created () {
    // this.pageInit() // 先初始化arr 初始化供应商列表 // 初始化门店列表
    this.getDrugsCategoryType()
  },
  mounted () {
    // this.$refs.firstTab.getDataList(0)
  },
  methods: {
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      if (isMultiple === false) {
        this.dataForm.StoreId = choseStoreId
      }
    },
    // 并发请求 供应商、药态(并发请求，最后单独请求第四个，根据当前登陆账号觉得是否禁用门店下拉)
    getDrugsCategoryType () {
      API.drugs.getDrugsCategory().then(result => {
        if (result.code === '0000') {
          // this.drugsCategoryList = result.data.filter((item, index) => { return index > 0 }) // 初始化药态
          this.drugsCategoryList = result.data // 初始化药态
          this.dataForm.CategoryText = this.drugsCategoryList[0].text
          this.dataForm.CategoryId = this.drugsCategoryList[0].id
        }
      })
    },
    categoryTextHandle (text) {
      this.drugsCategoryList.forEach(item => {
        if (item.text === text) {
          this.dataForm.CategoryId = item.id // 这个药态的id会传递给子组件，用于弹窗时正确请求对应的药材列表
          this.oldCategoryText = item.text
          console.log(this.dataForm.CategoryText)
          console.log(this.dataForm.CategoryId)
        }
      })
    },
    pageInit () {
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
        case 'third':
          this.isVisible = this.isVisible.map((item, index) => {
            return index === 2 ? {child: true} : {child: false}
          })
          break
      }
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
  &-storeStock /deep/ {
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
.mod-storeStock{
  & /deep/ .el-form-item {
    margin-bottom: 14px;
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
