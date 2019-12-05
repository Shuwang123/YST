<template>
  <el-dialog
    v-dialogDrag
    :title="$store.getters.getRegisterStep === 1 ? '挂号信息填写' : $store.getters.getRegisterStep === 2 ? '门店患者调用' : '建立新的患者'" :width="'678px'"
    :close-on-click-modal="false"
    :visible.sync="outerVisible" @close="handleClose" class="registerIndex">
    <!--vuex 1、2、3-->
    <!--one div-->
    <transition mode="out-in">
    <div v-if="show">
      <div class="ownScrollbar" style="min-height: 420px;overflow-y: scroll;">
        <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="70px" size="mini" :inline="true">
          <el-row>
            <el-col><div style="padding-top: 5px; font-size: 16px; font-weight: 900;color: #1CA579">患者信息：</div></el-col>
          </el-row>
          <div style="padding-left: 32px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名" prop="UserName">
                  <el-input v-model="dataForm.UserName" placeholder="选择患者" style="width: 80px" disabled></el-input>
                  <span class="iconfont icon-renwu-zengjia" style="display: inline-block;width: 40px;height: 30px;
                              font-size: 26px;font-weight: 900;color: #1EA57B; margin-left: 5px; vertical-align: top"
                        @click="show = !show; openPatientList(); $store.commit('setRegisterStep', 2)" ></span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="性别">
                  <el-input v-model="dataForm.Sex" placeholder="只读" style="width: 80px" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="年龄">
                  <el-input v-model="dataForm.BirthDate" placeholder="只读" style="width: 80px" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="电话">
                  <el-input v-model="dataForm.MobilePhone" placeholder="只读" style="width: 140px" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12"><p>病历编号：<span v-text="dataForm.Code"></span></p></el-col>
              <el-col :span="12"><p>会员卡号：<span v-text="dataForm.MobilePhone"></span></p></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="填写地址">
                  <el-input v-model="dataForm.Address" placeholder="请输入地址详情" style="width: 465px" disabled></el-input>
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
            <el-col><div style="padding-top: 5px;font-size: 16px;font-weight: 900;color: #1CA579">收费信息：</div></el-col>
          </el-row>
          <div style="padding-left: 32px">
            <!--<el-row>-->
              <!--<el-col :span="12"><p>挂号单号：<span v-text="'201904190001'"></span></p></el-col>-->
              <!--<el-col :span="12"><p>操作时间：<span v-text="'2019-04-19 12:00:00'"></span></p></el-col>-->
            <!--</el-row>-->
            <!--第一行-->
            <el-row>
              <el-col :span="24">
                <el-form-item label="类型"><!--看诊类型-->
                  <el-radio-group v-model="dataForm.DiagnosisType">
                    <el-radio-button label="1">初诊</el-radio-button>
                    <el-radio-button label="2">复诊</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <!--第二行-->
            <el-row>
              <el-col :span="12">
                <el-form-item label="收费类型"><!--柜台收费类型-->
                  <el-select v-model="dataForm.chargeType" style="width: 100px"
                             @change="chargeTypeChange" placeholder="收费类型">
                    <el-option v-for="item in optionsChargeType"
                               :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <!--第三行-->
            <el-row>
              <el-col :span="12">
                <el-form-item label="支付方式"><!--患者支付方式-->
                  <el-select v-model="dataForm.RegisterPaymentWay" style="width: 100px" placeholder="支付方式">
                    <el-option v-for="item in optionsPaymentType" :key="item.value"
                               :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="挂号费" prop="RegisterAmount">
                  <el-input v-model="dataForm.RegisterAmount" placeholder="挂号费"
                            style="width: 85px" clearable :disabled="RegisterBool"></el-input> ￥
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>

      <el-dialog
        width="500px"
        title="小票内容"
        :visible.sync="innerVisible"
        append-to-body
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="true">
        <!--打印层：要求打印纸设置（12.00 * 93.10） chrome：无边距、无页眉页脚打印-->
        <div id="chenxiPrint">
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
            <!--<td colspan="2"><p>￥{{registerAllData.}}-->
            <!--<span style="display: inline-block;width: 200px;text-align: right"></span></p></td>-->
            <!--</tr>-->
            <tr valign="bottom">
              <td height="50"></td>
              <td colspan="2"><p>
                <span style="display: inline-block;width: 210px;text-align: right">{{registerAllData.RegisterPaymentWayName}}</span></p></td>
            </tr>

            <tr>
              <td colspan="1">合计：￥{{registerAllData.RegisterAmount}}</td>
              <td colspan="2"><p>大写：{{sumChinese(registerAllData.RegisterAmount)}}</p></td>
            </tr>
            <tr>
              <td colspan="3">药品为特殊商品，一经售出概不退换 </td>
            </tr>
            <tr>
              <td colspan="3">收费人员：{{$store.getters.getAccountLoginInfoAll.NickName}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div style="text-align: right"><el-button type="primary" @click="chenxiPrint()">打印挂号小票</el-button></div>
      </el-dialog>

      <div style="text-align: right; margin-top: 30px">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dataFormSubmit()" :disabled="isOKClick">挂号</el-button>
          <el-button @click="outerVisible = false">取消</el-button>
          <!--<el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button>-->
        </span>
      </div>

    </div>
    </transition>

    <transition mode="out-in">
      <!--two div-->
      <div v-if="!show">
        <first-patient-list v-if="addOrUpdateVisible" ref="patientList" @childEven="patientListFun"></first-patient-list>
      </div>
    </transition>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import {Currency, Letter, NumberInt, NumberFloat, calcAge} from '../../utils/validate'
import '../common/icon/iconfont.css'
// import {treeDataTranslate} from '@/utils'
import FirstPatientList from './first-patient-list'
export default {
  components: { FirstPatientList },
  watch: {
    'dataForm.RegisterAmount': function (newval, oldval) {
      if (String(newval).replace(/\s/g, '').length !== String(newval).length) {
        this.$alert('此处禁止填写‘空格’ ! ', '输入提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.dataForm.RegisterAmount = ''
          }
        })
      }
      if (Number(newval) === 0) { return false }
      if (!this.regMoney.test(newval)) {
        this.$alert('你输入的金额不合规范! ', '输入提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.dataForm.RegisterAmount = ''
          }
        })
      }
    }
  },
  data () {
    return {
      outerVisible: false,
      innerVisible: false,
      regMoney: /^\d+\.?\d{0,2}$/,
      show: true,
      dataListLoading: false, // 加载

      doctorId: '',
      doctorName: '',
      dataForm: {
        UserName: '',
        Sex: '',
        BirthDate: '',
        MobilePhone: '',
        Address: '',
        UserId: '',
        Code: '',

        RegisterPaymentWay: 1, // 支付方式
        DiagnosisType: '1', // 看诊类型
        chargeType: '只挂号', // 收费类型（药房）
        RegisterAmount: '', // 挂号费 ''初始值
        ConsultationAmount: 0, // 诊疗费
        reality: 0, // 实收
        give: 0 // 找零
      },
      RegisterBool: false, // 禁用

      dataList: null,
      addOrUpdateVisible: false,
      dataRule: {
        UserName: Currency('此为必填项'),
        RegisterAmount: Currency('此为必填项'),
        ConsultationAmount: Currency('此为必填项'),
        reality: Currency('此为必填项'),
        give: Currency('此为必填项')
      },
      optionsChargeType: [
        { // 药房收费类型
          value: '0元号',
          label: '0元号'
        }, {
          value: '只挂号',
          label: '只挂号'
        }
      ],
      optionsPaymentType: [
        { // 患者支付类型
          label: '现金',
          value: 1
        }, {
          label: '支付宝',
          value: 2
        }, {
          label: '微信扫码',
          value: 3
        }, {
          label: '银行卡',
          value: 4
        }, {
          label: '医保',
          value: 5
        }, {
          label: '微信客服手机',
          value: 6
        }, {
          label: '代金券',
          value: 7
        }, {
          label: '会员卡',
          value: 8
        },
        {
          label: '白露',
          value: 9
        },
        {
          label: '万科',
          value: 10
        },
        {
          label: '善郎中',
          value: 11
        },
        {
          label: '美团',
          value: 12
        }
      ],
      registerAllData: {},
      isOKClick: false
    }
  },
  created () {
    this.$store.commit('setRegisterStep', 1)
  },
  methods: {
    patientListFun (row) { // 患者列表，子层点击‘载入’时触发
      this.show = !this.show
      this.dataForm.UserName = row.UserName
      this.dataForm.Sex = row.Sex === 1 ? '男' : '女'
      this.dataForm.BirthDate = row.BirthDate
      this.dataForm.MobilePhone = row.MobilePhone
      this.dataForm.Address = row.Address
      this.dataForm.UserId = row.Id
      this.dataForm.Code = row.Code
    },
    // 获取某个入库单详情info
    init (row) {
      this.outerVisible = true
      this.dataListLoading = true
      if (row !== undefined) {
        this.doctorId = row.Id // 医生id
        this.doctorName = row.NickName
        this.dataForm.RegisterAmount = row.RegisterAmount
      }
      this.dataListLoading = false
    },
    chargeTypeChange (val) {
      switch (val) {
        case '0元号':
          this.dataForm.RegisterAmount = 0
          this.dataForm.ConsultationAmount = 0
          this.RegisterBool = true
          break
        case '只挂号':
          this.dataForm.RegisterAmount = ''
          this.dataForm.ConsultationAmount = 0
          this.RegisterBool = false
          break
      }
    },
    handleClose () {
      this.show = true
      this.$store.commit('setRegisterStep', 1)
      this.doctorId = ''
      this.doctorName = ''
      this.dataForm = {
        UserName: '',
        Sex: '',
        BirthDate: '',
        MobilePhone: '',
        Address: '',
        UserId: '',
        Code: '',

        RegisterPaymentWay: 1, // 支付方式
        DiagnosisType: '1', // 看诊类型
        chargeType: '只挂号', // 收费类型（药房）
        RegisterAmount: '', // 挂号费
        ConsultationAmount: 0 // 诊疗费
      }
      this.RegisterBool = false // 禁用
      this.isOKClick = false
      this.$refs['dataForm'].clearValidate()
    },

    // 表单提交
    dataFormSubmit () {
      this.isOKClick = true
      setTimeout(() => {
        this.isOKClick = false
      }, 1000)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var params = {
            StoreId: this.$store.getters.getAccountCurrentHandleStore,
            AccountId: this.doctorId, // 医生id
            UserId: this.dataForm.UserId, // 患者id
            OrderType: 1, // 1挂号 2退号
            DiagnosisType: this.dataForm.DiagnosisType, // 初诊 复诊

            RegisterAmount: this.dataForm.RegisterAmount, // 挂号费
            ConsultationAmount: this.dataForm.ConsultationAmount, // 诊疗费
            RegisterPaymentWay: this.dataForm.RegisterPaymentWay,

            RegisterStatus: 2, // 上面两个费用的支付状态，（默）1未支付 2已支付； 这儿的页面是前台挂号的嘛，99.99%都是已支付才挂号的所以直接一个2
            Remark: this.dataForm.RegisterPaymentWay
          }
          console.log(params)
          API.register.registerSubmit(params).then(result => {
            if (result.code === '0000') {
              this.$message({
                message: `${'挂号成功'}`,
                type: 'success',
                duration: 3000
              })
              // 在这写打印吧
              API.register.getRegisterInfo({id: result.id}).then(result => {
                if (result.code === '0000') {
                  console.log(result.data)
                  result.data.BirthDate = calcAge(result.data.BirthDate)
                  this.registerAllData = result.data
                  this.$nextTick(() => { this.innerVisible = true })
                }
                this.outerVisible = false
              })
            } else {
              this.$message.error(result.message)
            }
          })
        } else {
          this.$alert('挂号信息不完整! ', '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },

    // 打印功能
    chenxiPrint () {
      // console.log('陈希', this.$refs.chenxiPrint)
      var printHTML = document.getElementById('chenxiPrint').innerHTML // 获取要打印的内容
      var page = window.open('', '_blank') // 打开一个新窗口，用于打印
      page.document.write(printHTML) // 写入打印页面的内容
      page.print() // 打印
      var userAgent = navigator.userAgent
      if ((userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) || (userAgent.indexOf('Edge') > -1) || (userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1)) {
        page.document.execCommand('print')
      } else {
        console.log('not IE')
      }
      page.close() // 关闭打印窗口
      this.innerVisible = false
    },
    // 打印功能结束

    // 金额转中文大写
    sumChinese (n) {
      if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '数据非法'
      var unit = '千百拾亿千百拾万千百拾元角分'
      var str = ''
      n += '00'
      var p = n.indexOf('.')
      if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2)
      unit = unit.substr(unit.length - n.length)
      for (var i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
      return str.replace(/零(千|百|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万|壹(拾)/g, '$1$2').replace(/^元零?|零分/g, '').replace(/元$/g, '元整')
    },

    openPatientList () {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.patientList.init()
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.registerIndex /deep/ .el-form-item {
  margin-bottom: 7px;
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
