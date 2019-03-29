<template>

    <div class="mod-purchaseList">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="">
            <el-select v-model="dataForm.SupplierId" placeholder="供应厂商" size="mini" clearable style="width: 120px">
              <el-option v-for="item in SupplierIdArr" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="dataForm.StoreId" placeholder="采购门店" size="mini" clearable style="width: 120px">
              <el-option v-for="item in StoreArr" :key="item.Id" :label="'['+item.Id+']'+item.Name" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="dataForm.code" placeholder="采购单批次" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="getDataList()" size="mini">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!--<el-tab-pane label="成品药品" name="second" disabled="true">-->
      <el-tab-pane label="" name="first">
        <span slot="label"><i class="el-icon-date"></i> 所有采购</span>
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
        <span slot="label"><i class=""></i> 收货完成</span>
        <transition name="chenxi">
          <first-tab v-if="isVisible[2].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
        </transition>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTab from './first-tab'
export default {
  data () {
    return {
      activeName: 'first',
      SupplierIdArr: [], // 先请求供应商数组
      StoreArr: [], // 先请求门店数组
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
        {child: false}
      ]
    }
  },
  components: {
    FirstTab
  },
  created () {
    this.pageInit() // 先初始化arr 初始化供应商列表 // 初始化门店列表
  },
  mounted () {
    this.$refs.firstTab.getDataList()
  },
  methods: {
    pageInit () {
      this.dataListLoading = true
      API.supplier.getSupplierList({name: '', PageIndex: '1', PageSize: '1000', IsPaging: true, code: ''}).then(result => {
        if (result.code === '0000') {
          this.SupplierIdArr = result.data
        }
      })
      API.store.storeAll({PageIndex: 1, PageSize: 1000, IsPaging: true}).then(result => {
        if (result.code === '0000') {
          this.StoreArr = result.data
        }
      })
      this.dataListLoading = false
    },
    handleClick (tab, event) {
      // console.log(tab, event)
      if (tab.name === 'first') {
        this.isVisible = this.isVisible.map((item, index) => {
          return index === 0 ? {child: true} : {child: false}
        })
      } else if (tab.name === 'second') {
        this.isVisible = this.isVisible.map((item, index) => {
          return index === 1 ? {child: true} : {child: false}
        })
      } else if (tab.name === 'third') {
        this.isVisible = this.isVisible.map((item, index) => {
          return index === 2 ? {child: true} : {child: false}
        })
      }
      // console.log(this.isVisible)
      this.$nextTick(() => {
        this.isVisible.forEach((item, index) => {
          if (item.child === true) {
            if (index === 0) {
              this.$refs.firstTab.getDataList()
            } else if (index === 1) {
              this.$refs.firstTab.getDataList()
            } else if (index === 2) {
              this.$refs.firstTab.getDataList()
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
  transform: translate(50px, 30px);
}
.chenxi-enter-to, .chenxi-leave {
  transform: translate(0, 0);
}
.chenxi-enter-active,
.chenxi-leave-active {
  transition: all 0.4s ease;
}
.chenxi-leave-to {
  transform: translateX(-100px);
}
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
</style>
