<template>
  <el-dialog
    v-dialogDrag
    :title="'划价收费'" :width="isAddActive === false ? '650px' : '1190px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose" class="charge-info">
    <el-container>

      <el-aside v-if="isAddActive"  :width="isAddActive === false ? '100%' : '47%'" style="padding: 0 15px !important;border-right: 1px solid #E6E6E6">
        <el-row><el-col :span="24"><p>处方编号：<span v-text="registerAllData.Code" style="border-bottom: 1px solid #333;"></span></p></el-col></el-row>
        <el-row style="text-align: center;font-size: 20px;margin: 20px 0"><el-col :span="24"><b>{{registerAllData.StoreName}}处方笺</b></el-col></el-row>
        <!--header-->
        <el-row style="border-bottom: 1px solid #333;height: 30px;line-height: 30px">
          <el-col :span="8">门诊号：{{registerAllData.StoreName}}</el-col>
          <el-col :span="8">科室：{{registerAllData.DepartmentTypeName}}</el-col>
          <el-col :span="8">日期：{{registerAllData.CreatedOnTime.substring(0, 10)}}</el-col>
        </el-row>
        <el-row style="border-bottom: 1px solid #333;height: 30px;line-height: 30px">
          <el-col :span="8">姓名：{{registerAllData.UserName}}</el-col>
          <el-col :span="8">性别：{{registerAllData.SexName}}</el-col>
          <el-col :span="8">年龄：{{registerAllData.BirthDate}}</el-col>
        </el-row>
        <el-row style="border-bottom: 1px solid #333;height: 30px;line-height: 30px">
          <el-col :span="24">诊断结果：{{registerAllData.DiseaseInfo}}</el-col>
        </el-row>

        <!--循环-->
        <el-row style="font-size: 18px;margin: 5px 0">
          <el-col :span="12">RP：</el-col>
          <el-col :span="12" style="text-align: right;">{{registerAllData.Total}} 剂</el-col>
        </el-row>
        <el-row style="text-align: center;min-height: 300px">
          <el-col :span="12" v-for="item in registerAllData.SaleOrderItems" :key="item.ProductId">
            <span style="display: inline-block;width: 100px;text-align: right">{{item.ProductName}}</span>
            <span style="display: inline-block;width: 100px;text-align: left">{{item.RefundableQty}} {{item.Unit}}</span>
          </el-col>
        </el-row>

        <!--footer-->
        <el-row style="border-bottom: 1px solid #333;height: 30px;line-height: 30px">
          <el-col :span="24">用法及医嘱：{{registerAllData.DrugRate}} ; {{registerAllData.DoctorAdvice}}</el-col>
        </el-row>
        <el-row style="border-bottom: 1px solid #333;height: 30px;line-height: 30px">
          <el-col :span="24">地址：{{registerAllData.Address}}</el-col>
        </el-row>
        <el-row style="border-bottom: 1px solid #333;height: 30px;line-height: 30px">
          <el-col :span="6">药费：{{registerAllData.OrderAmount}}</el-col>
          <el-col :span="6">挂号费：{{registerAllData.RegisterAmount}}</el-col>
          <el-col :span="6">诊疗费：{{registerAllData.ConsultationAmount}}</el-col>
          <el-col :span="6">总金额：{{registerAllData.TotalAmount}}￥</el-col>
        </el-row>
        <el-row style="border-bottom: 1px solid #333;height: 30px;line-height: 30px">
          <el-col :span="6">审核：{{registerAllData.Total}}</el-col>
          <el-col :span="6">调配：{{registerAllData.Total}}</el-col>
          <el-col :span="6">核发：{{registerAllData.Total}}</el-col>
          <el-col :span="6">医生：{{registerAllData.DoctorName}}</el-col>
        </el-row>
      </el-aside>

      <el-main>
        <div class="ownScrollbar" style="min-height: 390px;overflow-y: scroll;"
             v-loading="dataListLoading">
          <el-row>
            <el-col><div style="padding-top: 5px; font-size: 16px; font-weight: 900;color: #1CA579">就诊信息：</div></el-col>
          </el-row>
          <div style="padding-left: 32px">
            <el-row>
              <el-col :span="8"><span>病历号：</span>{{registerAllData.Code}}</el-col>
              <el-col :span="8"><span>电话：</span>{{registerAllData.MobilePhone}}</el-col>
              <el-col :span="8"><span>会员：</span>{{registerAllData.MobilePhone}}</el-col>
            </el-row>
          </div>

          <!--分割线-->
          <el-row>
            <el-col><div style="padding-top: 5px;font-size: 16px;font-weight: 900;color: #1CA579">收费项目：</div></el-col>
          </el-row>
          <div style="padding-left: 32px">
            <el-row>
              <el-col :span="24"><span>类型：</span>{{registerAllData.DiagnosisTypeName}}</el-col>
            </el-row>
            <!-- 模拟表头-->
            <el-row style="text-align: center; font-weight: 700; border: 1px solid #ccc; border-left: none; border-right: none;height: 35px;line-height: 35px">
              <el-col :span="6">收费类型</el-col>
              <el-col :span="6">合计</el-col>
              <el-col :span="6">收费状态</el-col>
              <el-col :span="6">操作</el-col>
            </el-row>
            <!--模拟表体-->
            <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 30px;line-height: 30px;clear: both">
              <el-col :span="6">挂号费</el-col>
              <el-col :span="6">{{registerAllData.RegisterAmount}}￥</el-col>
              <el-col :span="6">{{registerAllData.RegisterStatusName ? registerAllData.RegisterStatusName : '无'}}</el-col>
              <el-col :span="6">- -</el-col>
            </el-row>
            <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 30px;line-height: 30px;clear: both">
              <el-col :span="6">诊疗费</el-col>
              <el-col :span="6">{{registerAllData.ConsultationAmount}}￥</el-col>
              <el-col :span="6">{{registerAllData.RegisterStatusName ? registerAllData.RegisterStatusName : '无'}}</el-col>
              <el-col :span="6">- -</el-col>
            </el-row>
            <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 30px;line-height: 30px;clear: both">
              <el-col :span="6">药费</el-col>
              <el-col :span="6">{{registerAllData.TotalAmount}}￥</el-col>
              <el-col :span="6">{{registerAllData.StatusName ? registerAllData.StatusName : '无'}}</el-col>
              <el-col :span="6">
                <!--<span style="color: #409EFF;cursor: pointer;text-align: center">- -</span>-->
                <span @click="seeRecipelInfo" style="color: #409EFF;cursor: pointer;text-align: center">{{isAddActive === false ? '处方' : '处方'}}详情</span>
              </el-col>
            </el-row>
          </div>

          <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="70px" size="mini" :inline="true">
            <el-row style="margin-top: 30px;text-align: center;font-weight: 500; font-size: 16px">
              <el-col :span="12">
                <el-form-item label="总共金额">
                  <el-input v-model="registerAllData.TotalAmount" placeholder="总金额" style="width: 100px" disabled size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="margin-bottom: 10px">
                <el-form-item label="支付方式"><!--患者支付方式-->
                  <el-select v-model="dataForm.PaymentWay" style="width: 100px" placeholder="支付方式">
                    <el-option v-for="item in optionsPaymentType" :key="item.value"
                    :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="实收" prop="reality">
                  <el-input @blur="realityBlur" v-model="dataForm.reality" style="width: 100px" clearable="" size="small" :disabled="shiji"></el-input>
                  <!--<el-input v-model="dataForm.reality" style="width: 90px" clearable="" size="small" :disabled="shiji"></el-input> ￥-->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="找零" prop="give">
                  <el-input v-model="dataForm.give" style="width: 100px" clearable size="small" :disabled="shiji"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-main>

    </el-container>
    <div style="text-align: right">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dataFormSubmitA()">收费</el-button>
        <el-button type="primary" @click="dataFormSubmitA()">打印</el-button>
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </div>
    <first-tab-add-or-update-info v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataListChild"></first-tab-add-or-update-info>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import '../common/icon/iconfont.css'
import {calcAge} from '@/utils/validate'

export default {
  data () {
    return {
      visible: false,
      dataListLoading: false, // 加载

      dataForm: {
        PaymentWay: 1 // 支付方式
      },
      optionsPaymentType: [
        { // 患者支付类型
          value: 1,
          label: '现金'
        }, {
          value: 2,
          label: '支付宝'
        }, {
          value: 3,
          label: '微信'
        }, {
          value: 4,
          label: '银行卡'
        }
      ],
      isAddActive: true,

      registerAllData: '', // 挂号单全部信息
      addOrUpdateVisible: false // dataRule: {UserName: Currency('此为必填项')},
    }
  },
  methods: {
    // 根据表单的Id，获取对应挂号单的详情
    init (formId) {
      if (formId) {
        this.visible = true
        this.dataListLoading = true
        API.register.getRegisterInfo({id: formId}).then(result => {
          if (result.code === '0000') {
            result.data.BirthDate = calcAge(result.data.BirthDate)
            this.registerAllData = result.data
            this.dataListLoading = false
            console.log('查看', result.data)
          }
        })
      }
    },
    seeRecipelInfo () {
      this.isAddActive = !this.isAddActive // 点击'[添加药材]'按钮
    },
    chargeTypeChange (val) {
      // switch (val) {
      //   case '0元号':
      //     this.dataForm.RegisterAmount = 0
      //     this.dataForm.ConsultationAmount = 0
      //     this.RegisterBool = true
      //     this.ConsultationBool = true
      //     break
      //   case '只挂号':
      //     this.dataForm.RegisterAmount = ''
      //     this.dataForm.ConsultationAmount = 0
      //     this.RegisterBool = false
      //     this.ConsultationBool = true
      //     break
      //   case '挂号+诊疗':
      //     this.dataForm.RegisterAmount = ''
      //     this.dataForm.ConsultationAmount = ''
      //     this.RegisterBool = false
      //     this.ConsultationBool = false
      //     break
      //   case '只诊疗':
      //     this.dataForm.RegisterAmount = 0
      //     this.dataForm.ConsultationAmount = ''
      //     this.RegisterBool = true
      //     this.ConsultationBool = false
      //     break
      //   case '疗程':
      //     this.dataForm.RegisterAmount = 0
      //     this.dataForm.ConsultationAmount = 0
      //     this.RegisterBool = true
      //     this.ConsultationBool = true
      //     break
      // }
    },
    handleClose () {
      this.isAddActive = true
    },
    // 表单提交
    dataFormSubmitA () {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //     var params = {
      //       StoreId: this.$store.getters.getAccountCurrentHandleStore,
      //       AccountId: this.doctorId, // 医生id
      //       UserId: this.dataForm.UserId, // 患者id
      //       OrderType: 1, // 1挂号 2退号
      //       DiagnosisType: this.dataForm.DiagnosisType, // 初诊 复诊
      //       RegisterAmount: this.dataForm.RegisterAmount, // 挂号费
      //       ConsultationAmount: this.dataForm.ConsultationAmount, // 诊疗费
      //       PaymentWay: this.dataForm.PaymentWay,
      //       Remark: this.dataForm.PaymentWay
      //     }
      //     console.log(params)
      //     API.register.registerSubmit(params).then(result => {
      //       if (result.code === '0000') {
      //         this.$message({
      //           message: `${'挂号成功'}`,
      //           type: 'success',
      //           duration: 3000
      //         })
      //         this.visible = false
      //       } else {
      //         this.$message.error(result.message)
      //       }
      //     })
      //   } else {
      //     this.$alert('挂号信息不完整! ', '提示', {
      //       confirmButtonText: '确定'
      //     })
      //   }
      // })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.charge-info /deep/ .el-form-item {
  margin-bottom: 0;
}
.ownScrollbar /deep/ {
  span {
    display: inline-block;
    width: 70px;
    text-align: right;
    height: 30px;
    line-height: 30px;
  }
}

/*出诊 复诊样式覆盖*/
.charge-info /deep/ {
  .el-dialog__body {

  }

  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px 9px;
  }
  /*只要半场动画*/
  .v-enter {opacity: 0}
  .v-enter-active {transition: all .4s ease}
  .v-leave-active {position:absolute}
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
.charge-info /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
  border-radius: 0;
  box-shadow: inset 0 0 5px rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
}
</style>
