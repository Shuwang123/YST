<template>
  <el-dialog
    v-dialogDrag
    :title="'划价收费'" :width="'678px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose" class="registerIndex">
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
          <el-col :span="8"><span>操作时间：</span>{{registerAllData.CreatedOnTime}}</el-col>
          <el-col :span="8"><span>医生：</span>{{registerAllData.DoctorName}}</el-col>
          <el-col :span="8"><span>类型：</span>{{registerAllData.DiagnosisTypeName}}</el-col>
        </el-row>
        <div style="border: 1px solid #ccc;padding: 10px">
          <el-row>
            <el-col :span="8">收费类型</el-col>
            <el-col :span="8">合计</el-col>
            <el-col :span="8">收费状态</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">挂号费</el-col>
            <el-col :span="8">{{registerAllData.RegisterAmount}}￥</el-col>
            <el-col :span="8">{{registerAllData.RegisterStatusName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">诊疗费</el-col>
            <el-col :span="8">{{registerAllData.ConsultationAmount}}￥</el-col>
            <el-col :span="8">{{registerAllData.RegisterStatusName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="8">药费</el-col>
            <el-col :span="8">{{registerAllData.ConsultationAmount}}￥</el-col>
            <el-col :span="8">{{registerAllData.RegisterStatusName}}</el-col>
          </el-row>
          <!--<el-col :span="24"><span>支付状态：</span>{{registerAllData.RegisterStatusName}}</el-col>-->
          <!--<el-col :span="24"><span>付费方式：</span>{{registerAllData.PaymentWayName}}</el-col>-->
          <!--<el-col :span="24"><span>看诊状态：</span>{{registerAllData.RegisterOrderStatusName}}</el-col>-->
        </div>
      </div>
      <el-row>
        <el-col :span="24">还需收费多少：30元…………………………………………………………………………………………还没写</el-col>
      </el-row>
    </div>
    <div style="text-align: right; margin-top: 30px">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dataFormSubmitA()">收费</el-button>
        <el-button type="primary" @click="dataFormSubmitA()">打印</el-button>
        <el-button @click="visible = false">关闭</el-button>
        <!--<el-button type="primary" @click="dataFormAdd()">挂号不打印</el-button>-->
      </span>
    </div>
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

      registerAllData: '', // 挂号单全部信息
      addOrUpdateVisible: false // dataRule: {UserName: Currency('此为必填项')},
    }
  },
  methods: {
    // 获取某个采购单详情info
    init (patientId) {
      if (patientId) {
        this.visible = true
        this.dataListLoading = true
        API.register.getRegisterInfo({id: patientId}).then(result => {
          if (result.code === '0000') {
            result.data.BirthDate = calcAge(result.data.BirthDate)
            this.registerAllData = result.data
            this.dataListLoading = false
            console.log(result.data)
          }
        })
      }
    },
    handleClose () {},
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
