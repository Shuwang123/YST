<template>
  <div class="doctor-recipel">
    <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
      <el-container style="padding-left: 20px">
        <el-aside width="75%" style="border-right: 1px solid #DCDFE6; padding-right: 5px">
          <h1>医生开方：</h1>
            <el-row>
              <el-col :span="8">
                <el-form-item label="姓名">
                  <el-input v-model="sizeForm.name" placeholder="请输入姓名" style="width: 94px"></el-input>
                  <!--<el-button type="warning" icon="iconfont icon-renwu-zengjia" @click="send()" size="mini"></el-button>-->
                  <span class="iconfont icon-renwu-zengjia" style="display: inline-block;width: 40px;height: 30px;
                        font-size: 26px;font-weight: 900;color: #1EA57B; margin-left: 7px; vertical-align: top"></span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="性别">
                  <el-radio-group v-model="sizeForm.name">
                    <el-radio-button label="男"></el-radio-button>
                    <el-radio-button label="女"></el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年龄">
                  <el-input-number v-model="sizeForm.age" :min="1" :step="1" :max="100" style="width: 95px"></el-input-number>
                  <!--<el-input-number v-model="sizeForm.age" :min="1" :step="1" :max="12" style="width: 95px"></el-input-number>-->
                  <div class="recipelAgeUnit">
                    <el-select v-model="sizeForm.ageUnit" style="width: 45px">
                      <el-option :label="'岁'" :value="'岁'"></el-option>
                      <el-option :label="'月'" :value="'月'"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="电话">
                  <el-input v-model="sizeForm.name" placeholder="请输入电话" style="width: 144px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="地址">
                  <el-input v-model="sizeForm.name" placeholder="请输入地址" style="width: 144px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="类型">
                  <el-radio-group v-model="sizeForm.name">
                    <el-radio-button label="初诊"></el-radio-button>
                    <el-radio-button label="复诊"></el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="发病时间">
                  <el-date-picker type="date" placeholder="请选择发病时间" v-model="sizeForm.date1"  style="width: 144px"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="过敏史">
                  <el-input v-model="sizeForm.name" placeholder="请输入过敏史" style="width: 144px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="主诉">
                  <el-input v-model="sizeForm.name" placeholder="请选择或输入主诉" style="width: 75%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="现病史">
                  <el-input v-model="sizeForm.name" placeholder="从起病到就诊时疾病的发生、发展及其他变化的经过和诊疗情况" style="width: 75%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="诊断信息">
                  <el-input v-model="sizeForm.name" placeholder="请选择或输入诊断信息" style="width: 75%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          <div style="border-bottom: 1px solid #E6E6E6; font-weight: 500">R:</div>
          <el-table
            @selection-change="selectionChangeHandle"
            :height="chenxiHeight"
            :data="dataList"
            stripe
            v-loading="dataListLoading"
            row-class-name="purchaseListRow"
            :header-cell-style="$cxObj.tableHeaderStyle30px"
            style="width: 100%;">
            <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
            <el-table-column prop="Id" header-align="center" align="center" label="药品/规格" width="100"></el-table-column>
            <el-table-column prop="Code" header-align="center" align="center" label="剂量" width="100"></el-table-column>
            <el-table-column prop="CreatedTime" header-align="center" align="center" label="代数" width="150"></el-table-column>

            <el-table-column prop="SupplierName" header-align="center" align="center" label="单价" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="StoreName" header-align="center" align="center" label="金额"></el-table-column>
            <el-table-column prop="Quantity" header-align="center" align="center" label="用法" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="" label="操作" :width="status == 1 ? 280 : 150" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="addOrUpdateHandle(scope.row.Id)">就诊</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-aside>

        <el-main style="padding: 10px; border-bottom: 1px solid #DCDFE6">
          <el-input v-model="sizeForm.name" placeholder="请选择或输入主诉" style="width: 100%" size="small" clearable>
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <br>
          <br>
          <div style="min-height: 500px; background-color: #f1f2f6;width: 90%;position: relative;">
            1
            <br>1
            <br>1
            <br>1
            <br>1
            <br>1
            <br>1
            <div style="position: absolute; right: -30px; top: 0px; width: 18px; height: 500px; background-color: lightgreen">
              A<br>
              B<br>
              C<br>
              D<br>
              E<br>
            </div>
          </div>
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="prev, pager, next, jumper, sizes, total" background>
          </el-pagination>

        </el-main>
      </el-container>

      <el-footer height="100px" style="padding-top: 7px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="总剂数">
              <el-input-number v-model="sizeForm.age" :min="1" :step="1" :max="30" style="width: 95px"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="用药方法">
              <el-select v-model="sizeForm.ageUnit" style="width: 144px" placeholder="请选择用药方法">
                <el-option :label="'一日一次饭后服'" :value="'岁'"></el-option>
                <el-option :label="'一日一次饭前服…'" :value="'月'"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医嘱">
              <el-input v-model="sizeForm.age" placeholder="请填写医嘱" style="width: 100%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="开方医生">
              <el-input v-model="sizeForm.name" placeholder="onlyReady" style="width: 110px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="font-weight: 500; font-size: 16px">
            &nbsp;&nbsp;&nbsp;总金额：￥0 - <el-input-number v-model="num" controls-position="right"
                                      @change="handleChange" :min="1" :max="10000" style="width: 100px" size="mini"></el-input-number>
            = ￥x元
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="success" icon="iconfont icon-ico_zhongyaofangguanli_zhongyaoqingling" @click="send()" size="medium">&nbsp;发送给药房</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-footer>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTab from './first-tab'
import ComStore from '../common/com-store'
import '../common/icon/iconfont.css'
export default {
  data () {
    return {
      sizeForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        age: 1,
        ageUnit: '岁'
      },
      chenxiHeight: document.documentElement['clientHeight'] - 633, // 心累，不要动

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
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 633 // 273 测试老半天
    }
  },
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
              this.$refs.firstTab.getDataList(this.num) // 已到货入库
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
.recipelAgeUnit {
  display: inline-block;
  /deep/ .el-input__inner {
    padding: 0 5px;
  }
}
.doctor-recipel /deep/ {
  background-color: #fff;
  margin: 0 10px;
  border: 1px solid #DCDFE6;
  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px 9px;
  }
}

/*!*vue过渡初次尝试*!*/
/*.chenxi-enter {*/
  /*transform: translate(40px, 30px);*/
  /*opacity: 0;*/
/*}*/
/*!*.chenxi-enter-to, .chenxi-leave {*/
/*transform: translate(0, 0);*/
/*opacity: 1;*/
/*}*!*/
/*.chenxi-enter-active,*/
/*.chenxi-leave-active {*/
  /*transition: all 0.6s ease;*/
/*}*/
/*!*.chenxi-leave-to {*/
  /*transform: translateX(-100px, 0);*/
/*}*!*/

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
.doctor-recipel /deep/ {
  .el-form-item {
    margin-bottom: 7px;
  }
  .el-dialog__body {
    padding-top: 10px;
  }
  /*表头高重写35高*/
  .el-table--medium th, .el-table--medium td, & .el-table th, & .el-table td,
  .el-table--medium th, .el-table--medium td, & .el-table th, & .el-table td {
    padding: 0 !important;
  }
  /*& /deep/ .el-tabs__content {background-color: #F0F0F0}*/
  .purchaseListRow {
    color: #606266;
    td {padding: 0;}
    td .cell{
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
