<template>

    <div class="mod-purchaseList">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">
        <!--<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">-->
        <el-form :inline="true" :model="dataForm">
          <el-form-item label="">
            <el-select v-model="dataForm.SupplierId" placeholder="供应厂商" size="mini" clearable style="width: 120px">
              <el-option v-for="item in SupplierIdArr" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <com-store :paramsFather="{
            'label_0': '',
            'size_1': 'mini',
            'width_2': '120px',
            'clear_3': true,
            'disabled_4': false,
            'multiple_5': false
          }" ref="comStoreOne" @eventStore="changeStoreData"
          ></com-store>
          <el-form-item>
            <el-input v-model="dataForm.code" placeholder="采购单批次" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="getChildDataList" size="mini">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!--<el-tab-pane label="成品药品" name="second" disabled="true">-->
      <el-tab-pane label="" name="first">
        <span slot="label"><i class="el-icon-date"></i> 全部</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[0].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="second">
        <span slot="label"><i class=""></i> 待收货</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[1].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="third">
        <span slot="label"><i class=""></i> 收到货未入库</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[2].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
      <el-tab-pane label="" name="four">
        <span slot="label"><i class=""></i> 已入库</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[3].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTab from './first-tab'
import ComStore from '../common/com-store'
export default {
  data () {
    return {
      activeName: 'first',
      SupplierIdArr: [], // 先请求供应商数组

      dataForm: {
        SupplierId: '',
        StoreId: '',
        code: '', // 采购单批号
        StartDate: '',
        EndDate: ''
      },
      isVisible: [
        {child: true},
        {child: false},
        {child: false},
        {child: false}
      ],
      num: 0
    }
  },
  components: {
    FirstTab,
    ComStore
  },
  created () {
    this.pageInit() // 先初始化arr 初始化供应商列表 // 初始化门店列表
  },
  mounted () {
    this.$refs.firstTab.getDataList(0)
  },
  methods: {
    getChildDataList () {
      this.$refs.firstTab.getDataList(this.num)
    },
    changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
      if (isMultiple === false) {
        this.dataForm.StoreId = choseStoreId
      }
    },
    pageInit () {
      this.dataListLoading = true
      API.supplier.getSupplierList({name: '', PageIndex: '1', PageSize: '1000', IsPaging: true, code: ''}).then(result => {
        if (result.code === '0000') {
          this.SupplierIdArr = result.data
        }
      })
      this.dataListLoading = false
    },
    handleClick (tab, event) {
      // console.log(tab, event)
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
        case 'four':
          this.isVisible = this.isVisible.map((item, index) => {
            return index === 3 ? {child: true} : {child: false}
          })
          break
      }
      // console.log(this.isVisible)
      this.$nextTick(() => {
        this.isVisible.forEach((item, index) => {
          if (item.child === true) {
            if (index === 0) {
              this.num = 0
              this.$refs.firstTab.getDataList(this.num)
            } else if (index === 1) {
              this.num = 1
              this.$refs.firstTab.getDataList(this.num) // 待收货
            } else if (index === 2) {
              this.num = 4
              this.$refs.firstTab.getDataList(this.num) // 已到货未入库
            } else if (index === 3) {
              this.num = 10
              this.$refs.firstTab.getDataList(this.num) // 已入库（已完成）
            }
          }
          return false
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
  &-purchaseList /deep/ {
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
.mod-purchaseList {
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
  & /deep/ .purchaseListRow {
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
