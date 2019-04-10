<template>
    <div class="mod-storeStock">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-select v-model="dataForm.StoreId" placeholder="可查询门店" size="mini" clearable style="width: 120px">
              <el-option v-for="item in StoreArr" :key="item.Id" :label="'['+item.Id+']'+item.Name" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataForm.ProductName" placeholder="商品名称" size="mini" clearable style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataForm.SpellName" placeholder="商品拼音" size="mini" clearable style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataForm.ProductCodeOrBarCode" placeholder="商品编码" size="mini" clearable style="width: 120px"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <!--<el-tab-pane label="成品药品" name="second" disabled="true">-->
      <el-tab-pane label="" name="first">
        <span slot="label"><i class="el-icon-upload"></i> 库存查看</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[0].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="second">
        <span slot="label"><i class=""></i> 库存历史</span>
        <transition name="chenxi">
          <second-tab v-if="isVisible[1].child" ref="firstTab" :fatherDataForm="dataForm"></second-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="third">
        <span slot="label"><i class=""></i> 库存批次流水</span>
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
export default {
  data () {
    return {
      activeName: 'first',
      // SupplierIdArr: [], // 先请求供应商数组
      StoreArr: [], // 先请求门店数组
      dataForm: { // 三个子组件共有的查询条件：门店，商品编码，商品名称
        StoreId: '',
        ProductCodeOrBarCode: '',
        ProductName: '',
        SpellName: ''
      },
      isVisible: [
        {child: true},
        {child: false},
        {child: false},
        {child: false}
      ]
    }
  },
  components: {
    FirstTab,
    SecondTab,
    ThirdTab
  },
  created () {
    this.pageInit() // 先初始化arr 初始化供应商列表 // 初始化门店列表
  },
  mounted () {
    // this.$refs.firstTab.getDataList(0)
  },
  methods: {
    pageInit () {
      this.dataListLoading = true
      // API.supplier.getSupplierList({name: '', PageIndex: '1', PageSize: '1000', IsPaging: true, code: ''}).then(result => {
      //   if (result.code === '0000') {
      //     this.SupplierIdArr = result.data
      //   }
      // })
      API.store.storeAll({PageIndex: 1, PageSize: 1000, IsPaging: true}).then(result => {
        if (result.code === '0000') {
          this.StoreArr = result.data
        }
      })
      this.dataListLoading = false
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
