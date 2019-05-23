<template>
  <el-dialog
    v-dialogDrag
    :title="'划价收费'" :width="isAddActive === false ? '750px' : '1100px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose" class="registerIndex">
    <el-container>
      <el-aside :width="isAddActive === false ? '100%' : '60%'">
        <div class="ownScrollbar" style="min-height: 390px;overflow-y: scroll;"
             v-loading="dataListLoading">
          <el-row>
            <el-col><div style="padding-top: 5px; font-size: 16px; font-weight: 900;color: #1CA579">就诊信息：</div></el-col>
          </el-row>
          <div style="padding-left: 32px">
            <el-row>
              <el-col :span="24"><span>挂号单号：</span>{{registerAllData.Code}}</el-col>
              <el-col :span="8"><span>姓名：</span>{{registerAllData.UserName}}</el-col>
              <el-col :span="8"><span>性别：</span>{{registerAllData.SexName}}</el-col>
              <el-col :span="8"><span>病历号：</span>{{registerAllData.Code}}</el-col>
              <el-col :span="8"><span>年龄：</span>{{registerAllData.BirthDate}}</el-col>
              <el-col :span="8"><span>电话：</span>{{registerAllData.MobilePhone}}</el-col>
              <el-col :span="8"><span>会员：</span>{{registerAllData.MobilePhone}}</el-col>
              <el-col :span="24"><span>患者地址：</span></el-col>
            </el-row>
          </div>

          <!--分割线-->
          <el-row>
            <el-col><div style="padding-top: 5px;font-size: 16px;font-weight: 900;color: #1CA579">收费项目：</div></el-col>
          </el-row>
          <div style="padding-left: 32px">
            <el-row>
              <el-col :span="9"><span>操作时间：</span>{{registerAllData.CreatedOnTime}}</el-col>
              <el-col :span="7"><span>医生：</span>{{registerAllData.DoctorName}}</el-col>
              <el-col :span="8"><span>类型：</span>{{registerAllData.DiagnosisTypeName}}</el-col>
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
                <span @click="seeRecipelInfo" style="color: #409EFF;cursor: pointer;text-align: center">{{isAddActive === false ? '查看' : '收起'}}详情</span>
              </el-col>
            </el-row>
            <!--<el-col :span="24"><span>支付状态：</span>{{registerAllData.RegisterStatusName}}</el-col>-->
            <!--<el-col :span="24"><span>付费方式：</span>{{registerAllData.PaymentWayName}}</el-col>-->
            <!--<el-col :span="24"><span>看诊状态：</span>{{registerAllData.RegisterOrderStatusName}}</el-col>-->
          </div>
          <!--<el-row>-->
          <!--<el-col :span="24">还需收费多少：30元…………………………………………………………………………………………还没写</el-col>-->
          <!--</el-row>-->
          <!--<el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="70px" size="mini" :inline="true">-->
          <!--<el-form-item label="支付方式">&lt;!&ndash;患者支付方式&ndash;&gt;-->
          <!--<el-select v-model="dataForm.PaymentWay" style="width: 100px" placeholder="支付方式">-->
          <!--<el-option v-for="item in optionsPaymentType" :key="item.value"-->
          <!--:label="item.label" :value="item.value"></el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-row style="margin-top: 10px;font-weight: 500; font-size: 16px">-->
          <!--<el-col :span="8">-->
          <!--<el-form-item label="总共金额">-->
          <!--<el-input v-model="sum" placeholder="总金额" style="width: 100px" disabled size="small"></el-input> ￥-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="8">-->
          <!--<el-form-item label="实收" prop="reality">-->
          <!--<el-input @blur="realityBlur" v-model="dataForm.reality" style="width: 90px" clearable="" size="small" :disabled="shiji"></el-input> ￥-->
          <!--&lt;!&ndash;<el-input v-model="dataForm.reality" style="width: 90px" clearable="" size="small" :disabled="shiji"></el-input> ￥&ndash;&gt;-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="8">-->
          <!--<el-form-item label="找零" prop="give">-->
          <!--<el-input v-model="dataForm.give" style="width: 90px" clearable size="small" :disabled="shiji"></el-input> ￥-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--</el-row>-->
          <!--</el-form>-->
        </div>
      </el-aside>

      <el-main v-if="isAddActive" style="padding: 0 0 0 5px !important; border-left: 1px solid #E6E6E6">
        <el-row style="text-align: center;font-size: 18px;margin-bottom: 10px"><el-col :span="24"><b>处方详情展示</b></el-col></el-row>
        <el-row style="text-align: center">
          <el-col :span="12" v-for="item in registerAllData.SaleOrderItems" :key="item.ProductId">
            <span style="display: inline-block;margin-right: 10px">{{item.ProductName}}</span>
            <span style="display: inline-block">{{item.RefundableQty}}{{item.Unit}}</span>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <div style="text-align: right; margin-top: 30px">
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
      isAddActive: false,

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
            console.log(result.data)
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
      this.isAddActive = false
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
.registerIndex /deep/ .el-form-item {
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
.registerIndex /deep/ {
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
.purchaseListInfo /deep/ .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
  border-radius: 0;
  box-shadow: inset 0 0 5px rgba(0,0,0,0);
  background-color: rgba(0,0,0,0);
}
</style>
