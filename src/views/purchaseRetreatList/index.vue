<template>
    <div class="mod-retreat-list">
        <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
            <div style="background-color: #F5F7FA;margin-bottom: -15px;border-radius: 0 0 0 0;padding: 1px 3px">
                <el-form :inline="true" :model="dataForm"><!--@keyup.enter.native="getDataList()"-->
                    <com-store :paramsFather="{
                        'label_0': '',
                        'size_1': 'mini',
                        'width_2': '120px',
                        'clear_3': false,
                        'multiple_4': false,
                        'must_5': true,
                        'isTrigger': true
                      }" ref="comStore" @eventStore="changeStoreData">
                    </com-store>
                    <el-form-item label="">
                        <el-select v-model="dataForm.SupplierId" placeholder="供应厂商" @change="getChildDataList"
                                   clearable @clear="getChildDataList" size="mini" style="width: 120px">
                            <el-option v-for="item in SupplierIdArr" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="dataForm.code" placeholder="退单单号" size="mini" style="width: 140px"
                                  @keyup.enter.native="getChildDataList" @clear="getChildDataList" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <!--:default-time="['12:00:00']"-->
                        <el-date-picker
                                size="mini"
                                v-model="value6" @change="getChildDataList"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                style="width: 260px">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button icon="el-icon-search" @click="getChildDataList" size="mini">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-tab-pane label="" name="first">
                <span slot="label"><i class="el-icon-date"></i> 全部单据</span>
                <transition name="chenxi">
                    <first-tab v-if="isVisible[0].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
                </transition>
            </el-tab-pane>
            <el-tab-pane label="" name="second">
                <span slot="label"><i class=""></i> 待审</span>
                <transition name="chenxi">
                    <first-tab v-if="isVisible[1].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
                </transition>
            </el-tab-pane>
            <el-tab-pane label="" name="third">
                <span slot="label"><i class=""></i> 已审</span>
                <transition name="chenxi">
                    <first-tab v-if="isVisible[2].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
                </transition>
            </el-tab-pane>
            <el-tab-pane label="" name="four">
                <span slot="label"><i class=""></i> 已出库</span>
                <transition name="chenxi">
                    <first-tab v-if="isVisible[3].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
                </transition>
            </el-tab-pane>
            <el-tab-pane label="" name="five">
                <span slot="label"><i class=""></i> 作废</span>
                <transition name="chenxi">
                    <first-tab v-if="isVisible[4].child" ref="firstTab" :fatherDataForm="dataForm"></first-tab>
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
          code: '', // 退单批号
          StartDate: '',
          EndDate: ''
        },
        isVisible: [
          {child: true},
          {child: false},
          {child: false},
          {child: false},
          {child: false}
        ],
        num: 0,
        value6: []
      }
    },
    components: {
      FirstTab,
      ComStore
    },
    created () {
      this.pageInit() // 先初始化arr 初始化供应商列表 // 初始化门店列表
    },
    watch: {
      'value6': function () {
        if (this.value6 !== [] && this.value6 !== null) {
          this.dataForm.StartDate = this.value6[0]
          this.dataForm.EndDate = this.value6[1]
        } else {
          this.dataForm.StartDate = ''
          this.dataForm.EndDate = ''
        }
      }
    },
    methods: {
      changeStoreData (choseStoreId, isMultiple) { // 任何账号唯一的归属门店
        if (isMultiple === false) {
          this.dataForm.StoreId = choseStoreId
          this.$refs.firstTab.getDataList(this.num)
        }
      },
      getChildDataList () {
        this.$nextTick(() => {
          this.$refs.firstTab.getDataList(this.num)
        })
      },
      pageInit () {
        this.dataListLoading = true
        API.supplier.getSupplierList({name: '', PageIndex: '1', PageSize: '1000', IsPaging: true, code: ''}).then(result => {
          if (result.code === '0000') {
            this.SupplierIdArr = result.data
          }
          this.dataListLoading = false
        })
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
          case 'five':
            this.isVisible = this.isVisible.map((item, index) => {
              return index === 4 ? {child: true} : {child: false}
            })
            break
        }
        // console.log(this.isVisible)
        this.$nextTick(() => {
          this.isVisible.forEach((item, index) => {
            if (item.child === true) {
              if (index === 0) {
                this.num = 0
                this.$refs.firstTab.getDataList(this.num) // 全部 -1 6,7,8 采购那边的全部是-1 1，4，10 // 都是-1时通过单据类型1，2区别
              } else if (index === 1) {
                this.num = 6
                this.$refs.firstTab.getDataList(this.num) // 6 待审
              } else if (index === 2) {
                this.num = 7
                this.$refs.firstTab.getDataList(this.num) // 7 已审
              } else if (index === 3) {
                this.num = 8
                this.$refs.firstTab.getDataList(this.num) // 8 已入库（已完成）
              } else if (index === 4) {
                this.num = -1
                this.$refs.firstTab.getDataList(this.num) // -1 作废
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
.chenxi-enter-active,
.chenxi-leave-active { transition: all 0.6s ease; }

.mod {
    &-retreat-list /deep/ { /*max-height: 810px;*/
        margin-left: 10px;
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
.mod-retreat-list /deep/ {
    .el-form-item { margin-bottom: 14px; }
    .el-dialog__body { padding-top: 10px; }
    /*表头高重写35高*/
    .el-table--medium th, .el-table--medium td, .el-table th, .el-table td,
    .el-table--medium th, .el-table--medium td, .el-table th, .el-table td {
        padding: 0 !important;
    }
    .purchaseListRow {
        color: #606266;
        & td {padding: 0;}
        & td .cell{
            height: 35px;
            line-height: 35px;
        }
    }
}
</style>