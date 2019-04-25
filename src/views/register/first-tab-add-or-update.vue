<template>
  <el-dialog
    v-dialogDrag
    :title="'挂号信息填写、所有历史患者列表、新建患者'" :width="'678px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose" class="registerIndex">
    <div v-if="show">
      <div class="ownScrollbar" style="min-height: 400px;overflow-y: scroll;">
        <el-form :inline="true" :model="dataForm" label-width="70px" size="mini">
          <el-row>
            <el-col><div style="padding-top: 5px; font-size: 16px; font-weight: 900;color: #1CA579">患者信息：</div></el-col>
          </el-row>
          <div style="padding-left: 32px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名">
                  <el-input v-model="dataForm.SpellName" placeholder="选择患者" style="width: 80px" disabled></el-input>
                  <span class="iconfont icon-renwu-zengjia" style="display: inline-block;width: 40px;height: 30px;
                              font-size: 26px;font-weight: 900;color: #1EA57B; margin-left: 5px; vertical-align: top"
                        @click="show = !show; openPatientList()" ></span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-input v-model="dataForm.SpellName" placeholder="只读" style="width: 80px" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="年龄">
                  <el-input v-model="dataForm.SpellName" placeholder="只读" style="width: 80px" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电话">
                  <el-input v-model="dataForm.SpellName" placeholder="只读" style="width: 140px" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12"><p>病历编号：<span v-text="'1904240001'"></span></p></el-col>
              <el-col :span="12"><p>会员卡号：<span v-text="'15023104895'"></span></p></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="填写地址">
                  <el-input v-model="dataForm.SpellName" placeholder="请输入地址详情" style="width: 465px" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <!--分割线-->
          <el-row>
            <el-col><div style="padding-top: 5px; font-size: 16px; font-weight: 900;color: #1CA579">医生信息：</div></el-col>
          </el-row>
          <div style="padding-left: 48px"><p>姓名：<span v-text="doctorName"></span></p></div>

          <el-row>
            <el-col><div style="padding-top: 5px;font-size: 16px;font-weight: 900;color: #1CA579">收费信息：<b v-text="categoryName"></b></div></el-col>
          </el-row>
          <div style="padding-left: 32px">
            <el-row>
              <el-col :span="12"><p>挂号单号：<span v-text="'201904190001'"></span></p></el-col>
              <el-col :span="12"><p>操作时间：<span v-text="'2019-04-19 12:00:00'"></span></p></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="类型">
                  <el-radio-group v-model="dataForm.type">
                    <el-radio-button label="初诊"></el-radio-button>
                    <el-radio-button label="复诊"></el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收费类型">
                  <el-select v-model="dataForm.ageUnit" style="width: 100px" placeholder="收费类型" clearable>
                    <el-option :label="'0元号'" :value="'0元号'"></el-option>
                    <el-option :label="'只挂号'" :value="'只挂号'"></el-option>
                    <el-option :label="'挂号+诊疗'" :value="'挂号+诊疗'"></el-option>
                    <el-option :label="'只诊疗'" :value="'只诊疗'"></el-option>
                    <el-option :label="'疗程'" :value="'疗程'"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="挂号费">
                  <el-input v-model="dataForm.SpellName" placeholder="挂号费(小数点没处理)" style="width: 85px" clearable></el-input> ￥
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="支付方式">
                  <el-select v-model="dataForm.ageUnit" style="width: 100px" placeholder="支付方式" clearable>
                    <el-option :label="'现金'" :value="'现金'"></el-option>
                    <el-option :label="'银行卡'" :value="'银行卡'"></el-option>
                    <el-option :label="'支付宝'" :value="'支付宝'"></el-option>
                    <el-option :label="'微信'" :value="'微信'"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="诊疗费">
                  <el-input v-model="dataForm.SpellName" placeholder="诊疗费" style="width: 85px" clearable></el-input> ￥
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="margin-top: 10px;font-weight: 500; font-size: 16px">
              <el-col :span="8">
                <el-form-item label="总共金额">
                  <el-input v-model="dataForm.SpellName" placeholder="总金额" style="width: 100px" disabled size="small"></el-input> ￥
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实收">
                  <el-input v-model="dataForm.SpellName" style="width: 90px" clearable="" size="small"></el-input> ￥
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="找零">
                  <el-input v-model="dataForm.SpellName" style="width: 90px" clearable size="small"></el-input> ￥
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div style="text-align: right; margin-top: 30px">
        <span slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="dataFormSubmitA()">挂号并打印</el-button>
        <el-button  type="primary" @click="dataFormAdd()">挂号不打印</el-button>
        <el-button @click="visible = false">取消</el-button>
      </span>
      </div>
    </div>
    <div v-if="!show">
      <first-patient-list v-if="addOrUpdateVisible" ref="patientList" @childEven="father001"></first-patient-list>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Letter, NumberInt, NumberFloat} from '../../utils/validate'
import '../common/icon/iconfont.css'
// import {treeDataTranslate} from '@/utils'
import FirstPatientList from './first-patient-list'
export default {
  components: { FirstPatientList },
  data () {
    return {
      show: true,
      stepActive: -1,
      visible: false,
      dataListLoading: false, // 加载
      Id: '',
      dataForm: {
        type: '初诊',
        SpellName: ''
      },
      doctorName: '',
      dataList: null,
      addOrUpdateVisible: false
    }
  },

  methods: {
    father001 () {
      this.show = !this.show
    },
    // 获取某个采购单详情info
    init (row) {
      this.visible = true
      this.dataListLoading = true
      if (row !== undefined) {
        this.doctorName = row.NickName
      }
      this.dataListLoading = false
    },
    handleClose () {
      this.editType = ''
      this.isAddActive = false
    },
    dataFormSubmitA () { // 编辑的提交 采购数量和价格
      var params = {
        Address: this.dataList.Address,
        Buyer: this.dataList.Buyer,
        Phone: this.dataList.Phone,
        OrderType: this.dataList.OrderType,
        Remark: this.dataList.Remark,
        StoreId: this.dataList.StoreId,
        StoreCode: this.dataList.StoreCode,
        Id: this.dataList.Id,
        SupplierId: this.dataList.SupplierId,
        SupplierCode: this.dataList.SupplierCode,
        Items: JSON.stringify(this.dataList.Items.map(item => {
          return {
            ProductId: item.ProductId,
            CostPrice: item.CostPrice,
            Quantity: item.Quantity,
            SapProductCode: item.SapProductCode,
            SupplierId: this.dataList.SupplierId,
            SupplierCode: this.dataList.SupplierCode // 这儿接口9返回的item.SupplierId用为零，导致不得不去获取总表的那个返回值
          }
          // [{\"ProductId\":23,\"CostPrice\":0,\"Quantity\":3,\"SapProductCode\":\"10000109\",\"SupplierId\":1,\"SupplierCode\":\"6006\"}
        }))
      }
      console.log(params)
      API.purchase.editNumberAndPrice(params).then(result => {
        if (result.code === '0000') {
          this.$message({
            type: 'success',
            message: `编辑${result.message}`,
            duration: 1000
          })
          this.$emit('refreshDataList')
          this.visible = false
        } else {
          this.$message({
            type: 'error',
            message: `${result.message}`,
            duration: 1000
          })
        }
      })
    },
    openPatientList (id, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.patientList.init(id, type)
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.registerIndex /deep/ .el-form-item {
  margin-bottom: 0px;
}
/*出诊复诊样式覆盖*/
.registerIndex /deep/ {
  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px 9px;
  }
}
.ownScrollbar::-webkit-scrollbar,
.purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
  width: 7px;
}
.ownScrollbar::-webkit-scrollbar-thumb,
.purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.1);
  background-color: #DDDEE0;
}
.ownScrollbar::-webkit-scrollbar-track,
.purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
  border-radius: 0;
  box-shadow: inset 0 0 5px rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
}
</style>
