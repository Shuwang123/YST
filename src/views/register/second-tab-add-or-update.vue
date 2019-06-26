<template>
  <el-dialog
    v-dialogDrag
    :title="'挂号详情'" :width="'678px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose" class="registerIndex">
    <div class="ownScrollbar" style="min-height: 390px;overflow-y: scroll;"
         v-loading="dataListLoading">
      <el-row>
        <el-col><div style="padding-top: 5px; font-size: 16px; font-weight: 900;color: #1CA579">患者信息：</div></el-col>
      </el-row>
      <div style="padding-left: 32px">
        <el-row>
          <el-col :span="24"><span>病历号：</span>{{registerAllData.Code}}</el-col>
          <el-col :span="12"><span>姓名：</span>{{registerAllData.UserName}}</el-col>
          <el-col :span="12"><span>性别：</span>{{registerAllData.SexName}}</el-col>
          <el-col :span="12"><span>年龄：</span>{{registerAllData.BirthDate}}</el-col>
          <el-col :span="12"><span>电话：</span>{{registerAllData.MobilePhone}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="12"><span>会员：</span>{{registerAllData.MobilePhone}}</el-col>
          <el-col :span="12"><span>地址：</span>{{registerAllData.AreaId}}</el-col>
        </el-row>
      </div>

      <!--分割线-->
      <el-row>
        <el-col><div style="padding-top: 5px;font-size: 16px;font-weight: 900;color: #1CA579">收费信息：</div></el-col>
      </el-row>
      <div style="padding-left: 32px">
        <el-row>
          <el-col :span="12"><span>挂号单号：</span>{{registerAllData.Code}}</el-col>
          <el-col :span="12"><span>操作时间：</span>{{registerAllData.CreatedOnTime}}</el-col>
          <!--<el-col :span="12"><span>操作时间：</span>{{registerAllData.CreatedOnTime | myDateFilter('yyyy-MM-dd hh:mm')}}</el-col>-->
          <el-col :span="12"><span>医生：</span>{{registerAllData.DoctorName}}</el-col>
          <el-col :span="12"><span>类型：</span>{{registerAllData.DiagnosisTypeName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="24"><span>挂号费：</span>{{registerAllData.RegisterAmount}}￥</el-col>
          <el-col :span="24"><span>诊疗费：</span>{{registerAllData.ConsultationAmount}}￥</el-col>

          <el-col :span="24"><span>支付状态：</span>{{registerAllData.RegisterStatusName}}</el-col>
          <el-col :span="24"><span>付费方式：</span>{{registerAllData.PaymentWayName}}</el-col>
          <el-col :span="24"><span>看诊状态：</span>{{registerAllData.RegisterOrderStatusName}}</el-col>
        </el-row>
      </div>

      <!--打印层：要求打印纸设置（12.00 * 93.10） chrome：无边距、无页眉页脚打印-->
      <div id="chenxiPrint" style="display: none">
        <table width="100%" style="font-size: 12px;padding-right: 55px">
          <tbody>
            <tr>
              <td colspan="3" align="center" height="24" style="margin-bottom: 20px;font-weight: 600"><h3>重庆一善堂中医门诊部收据</h3></td>
            </tr>
            <tr>
              <td colspan="3" height="24">患者：{{registerAllData.UserName}} {{registerAllData.SexName ? registerAllData.SexName : '__'}} {{registerAllData.BirthDate}}</td>
            </tr>
            <tr>
              <td colspan="2" height="24">单据号：{{registerAllData.Code}}</td>
              <td colspan="1" align="right" v-if="registerAllData.CreatedOnTime">打印时间：{{registerAllData.CreatedOnTime | myDateFilter('yyyy/MM/dd hh:mm:ss')}}</td>
            </tr>
            <tr>
              <td colspan="2" height="24">医生：{{registerAllData.DoctorName}}</td>
              <td colspan="1" align="right" width="240">病历号：{{registerAllData.Code}}</td>
            </tr>

            <tr valign="bottom" style="font-size: 12px">
              <td height="30">收费项目</td>
              <td colspan="2"><p>金额
                <span style="display: inline-block;width: 200px;text-align: right">收费方式</span></p></td>
            </tr>
            <tr>
              <td>挂号费</td>
              <td colspan="2"><p>￥{{registerAllData.RegisterAmount}}
                <span style="display: inline-block;width: 200px;text-align: right"></span></p></td>
            </tr>
            <!--<tr>-->
              <!--<td>诊疗费</td>-->
              <!--<td colspan="2"><p>￥{{registerAllData.RegisterAmount}}-->
                <!--<span style="display: inline-block;width: 200px;text-align: right"></span></p></td>-->
            <!--</tr>-->
            <tr valign="bottom">
              <td height="50"></td>
              <td colspan="2"><p>
                <span style="display: inline-block;width: 210px;text-align: right">{{registerAllData.PaymentWayName}}</span></p></td>
            </tr>

            <tr>
              <td colspan="1">合计：￥{{registerAllData.RegisterAmount}}</td>
              <td colspan="2"><p>大写：{{registerAllData.RegisterAmount}}</p></td>
            </tr>
            <tr>
              <td colspan="3">需开发票请于15日内开具，逾期不补! </td>
            </tr>
            <tr>
              <td colspan="3">收费人员：xx</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    <div style="text-align: right; margin-top: 30px">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chenxiPrint()">小票补打</el-button>
        <!--<el-button type="primary" @click="dataFormSubmitA()">退号</el-button>-->
        <!--<el-button type="primary" @click="dataFormSubmitA()">再次挂号</el-button>-->
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

    // 打印功能
    chenxiPrint () {
      var printHTML = document.getElementById('chenxiPrint').innerHTML // 获取要打印的内容
      var page = window.open('', '_blank') // 打开一个新窗口，用于打印
      page.document.write(printHTML) // 写入打印页面的内容
      page.print() // 打印
      var userAgent = navigator.userAgent
      if ((userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) || (userAgent.indexOf('Edge') > -1) || (userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1)) {
        // IE浏览器
        page.document.execCommand('print')
      } else {
        console.log('not IE')
      }
      page.close() // 关闭打印窗口
    },
    // 打印功能结束

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
