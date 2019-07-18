<template>
    <div class="mod-storeStock">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">
        <el-form :inline="true" :model="dataForm">
          <com-store :paramsFather="{
            'label_0': '',
            'size_1': 'mini',
            'width_2': '120px',
            'clear_3': false,
            'multiple_4': false,
            'must_5': true,
            'isTrigger': true
          }" ref="comStoreOne" @eventStore="changeStoreData"></com-store>

          <el-form-item>
            <el-input v-model="dataForm.ProductName" placeholder="商品名称" size="mini"
                      clearable @clear="tabChange()" @keyup.enter.native="tabChange()" style="width: 100px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataForm.SpellName" placeholder="商品拼音" size="mini"
                      clearable @clear="tabChange()" @keyup.enter.native="tabChange()" style="width: 100px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataForm.ProductCodeOrBarCode" placeholder="商品编码" size="mini" clearable style="width: 100px"></el-input>
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
          <second-tab v-if="isVisible[1].child" ref="secondTab" :fatherDataForm="dataForm"></second-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="third">
        <span slot="label"><i class=""></i> 库存批次流水</span>
        <transition name="chenxi">
          <third-tab v-if="isVisible[2].child" ref="thridTab" :fatherDataForm="dataForm"></third-tab>
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

      dataForm: { // 三个子组件共有的查询条件：门店，商品编码、商品名称、商品拼音
        StoreId: '',
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
  created () {}, // this.pageInit() // 先初始化arr 初始化供应商列表 // 初始化门店列表
  methods: {
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      if (isMultiple === false) {
        this.dataForm.StoreId = choseStoreId
        this.tabChange()
      }
    },
    pageInit () {
      // this.dataListLoading = true
      // // API.supplier.getSupplierList({name: '', PageIndex: '1', PageSize: '1000', IsPaging: true, code: ''}).then(result => {
      // //   if (result.code === '0000') {
      // //     this.SupplierIdArr = result.data
      // //   }
      // // })
      // this.dataListLoading = false
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
      this.tabChange()
    },
    // 点击tab或者切换门店时，请求当前tab下的dataList
    tabChange () {
      this.$nextTick(() => {
        if (this.isVisible[0].child) {
          this.$refs.firstTab.pageIndex = 1 // enter查询时出现的bug，这个bug和点击search按钮的bug处理方式差不多
          this.$refs.firstTab.getDataList()
        } else if (this.isVisible[1].child) {
          this.$refs.secondTab.getDataList()
        } else if (this.isVisible[2].child) {
          this.$refs.thridTab.getDataList()
        }
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
.chenxi-enter-active,
.chenxi-leave-active {
  transition: all 0.6s ease;
}

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
.mod-storeStock  /deep/ {
  .el-form-item { margin-bottom: 14px; }
  .el-dialog__body { padding-top: 10px; }
  /*表头高重写35高*/
  .el-table--medium th, .el-table--medium td, .el-table th, .el-table td,
  .el-table--medium th, .el-table--medium td, .el-table th, .el-table td {
    padding: 0 !important;
  }
  .storeStockListRow {
    color: #606266;
    & td {padding: 0;}
    & td .cell{
      height: 35px;
      line-height: 35px;
    }
  }
}
</style>
