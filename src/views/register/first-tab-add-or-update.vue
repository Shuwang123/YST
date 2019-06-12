<template>
  <el-dialog
    v-dialogDrag
    :title="$store.getters.getRegisterStep === 1 ? '挂号信息填写' : $store.getters.getRegisterStep === 2 ? '门店患者调用' : '建立新的患者'" :width="'678px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose" class="registerIndex">
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
              <el-col :span="12">
                <el-form-item label="挂号费" prop="RegisterAmount">
                  <el-input v-model="dataForm.RegisterAmount" placeholder="挂号费"
                            style="width: 85px" clearable :disabled="RegisterBool"></el-input> ￥
                </el-form-item>
              </el-col>
            </el-row>
            <!--第三行-->
            <el-row>
              <el-col :span="12">
                <el-form-item label="支付方式"><!--患者支付方式-->
                  <el-select v-model="dataForm.PaymentWay" style="width: 100px" placeholder="支付方式">
                    <el-option v-for="item in optionsPaymentType" :key="item.value"
                               :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="诊疗费" prop="ConsultationAmount">
                  <el-input v-model="dataForm.ConsultationAmount" placeholder="诊疗费"
                            style="width: 85px" clearable :disabled="ConsultationBool"
                            min="0"></el-input> ￥
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="margin-top: 10px;font-weight: 500; font-size: 16px">
              <el-col :span="8">
                <el-form-item label="总共金额">
                  <el-input v-model="sum" placeholder="总金额" style="width: 100px" disabled size="small"></el-input> ￥
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实收" prop="reality">
                  <el-input @blur="realityBlur" v-model="dataForm.reality" style="width: 90px" clearable="" size="small" :disabled="shiji"></el-input> ￥
                  <!--<el-input v-model="dataForm.reality" style="width: 90px" clearable="" size="small" :disabled="shiji"></el-input> ￥-->
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="找零" prop="give">
                  <el-input v-model="dataForm.give" style="width: 90px" clearable size="small" :disabled="shiji"></el-input> ￥
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
      <div style="text-align: right; margin-top: 30px">
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dataFormSubmitA()">挂号并打印</el-button>
          <el-button type="primary" @click="dataFormAdd()">挂号不打印</el-button>
          <el-button @click="visible = false">取消</el-button>
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
import {Currency, Letter, NumberInt, NumberFloat} from '../../utils/validate'
import '../common/icon/iconfont.css'
// import {treeDataTranslate} from '@/utils'
import FirstPatientList from './first-patient-list'
export default {
  components: { FirstPatientList },
  computed: {
    sum () { // Number('') === 0 === Number()
      return Number(this.dataForm.RegisterAmount) + Number(this.dataForm.ConsultationAmount)
    }
  },
  watch: {
    'dataForm.RegisterAmount': function (newval, oldval) {
      if (Number(newval) === 0) { return false }
      if (!this.regMoney.test(newval)) {
        this.$alert('你输入的金额不合规范! ', '输入提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.dataForm.RegisterAmount = ''
          }
        })
      }
    },
    'dataForm.ConsultationAmount': function (newval, oldval) {
      if (Number(newval) === 0) { return false }
      if (!this.regMoney.test(newval)) {
        this.$alert('你输入的金额不合规范! ', '输入提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.dataForm.ConsultationAmount = ''
          }
        })
      }
    },
    sum (newval, oldval) {
      if (newval === 0) {
        this.shiji = true
        this.dataForm.reality = 0
        this.dataForm.give = 0
      } else if (newval > 0) {
        this.shiji = false
        this.dataForm.reality = ''
        this.dataForm.give = ''
      }
    },

    // 如果这儿有点懵逼，往下翻还有个实际收费输入框的blur的方法：realityBlur
    'dataForm.reality': function (newval, oldval) {
      if (Number(newval) === 0) { return false }
      if (!this.regMoney.test(newval)) {
        this.$alert('你输入的金额不合规范! ', '输入提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.dataForm.reality = ''
            this.dataForm.give = ''
            return false
          }
        })
      }
      if (Number(newval) < this.sum) {
        return false
      } else {
        this.dataForm.give = Math.round((newval - this.sum) * 100) / 100 // 保留小数后两位
      }
    }
  },
  data () {
    return {
      regMoney: /^\d+\.?\d{0,2}$/,
      show: true,
      visible: false,
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

        PaymentWay: 1, // 支付方式
        DiagnosisType: '1', // 看诊类型
        chargeType: '只挂号', // 收费类型（药房）
        RegisterAmount: '', // 挂号费
        ConsultationAmount: 0, // 诊疗费
        reality: 0, // 实收
        give: 0 // 找零
      },
      RegisterBool: false, // 禁用
      ConsultationBool: true, // 禁用
      shiji: true,

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
        // , {
        //   value: '挂号+诊疗',
        //   label: '挂号+诊疗'
        // }, {
        //   value: '只诊疗',
        //   label: '只诊疗'
        // }, {
        //   value: '疗程',
        //   label: '疗程'
        // }
      ],
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
      ]
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
    // 获取某个采购单详情info
    init (row) {
      this.visible = true
      this.dataListLoading = true
      if (row !== undefined) {
        this.doctorId = row.Id // 医生id
        this.doctorName = row.NickName
      }
      this.dataListLoading = false
    },
    chargeTypeChange (val) {
      switch (val) {
        case '0元号':
          this.dataForm.RegisterAmount = 0
          this.dataForm.ConsultationAmount = 0
          this.RegisterBool = true
          this.ConsultationBool = true
          break
        case '只挂号':
          this.dataForm.RegisterAmount = ''
          this.dataForm.ConsultationAmount = 0
          this.RegisterBool = false
          this.ConsultationBool = true
          break
        case '挂号+诊疗':
          this.dataForm.RegisterAmount = ''
          this.dataForm.ConsultationAmount = ''
          this.RegisterBool = false
          this.ConsultationBool = false
          break
        case '只诊疗':
          this.dataForm.RegisterAmount = 0
          this.dataForm.ConsultationAmount = ''
          this.RegisterBool = true
          this.ConsultationBool = false
          break
        case '疗程':
          this.dataForm.RegisterAmount = 0
          this.dataForm.ConsultationAmount = 0
          this.RegisterBool = true
          this.ConsultationBool = true
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

        PaymentWay: 1, // 支付方式
        DiagnosisType: '1', // 看诊类型
        chargeType: '只挂号', // 收费类型（药房）
        RegisterAmount: '', // 挂号费
        ConsultationAmount: 0, // 诊疗费
        reality: 0, // 实收
        give: 0 // 找零
      }
      this.RegisterBool = false // 禁用
      this.ConsultationBool = true // 禁用
      this.shiji = true
    },
    realityBlur () {
      if (Number(this.dataForm.reality) < this.sum) {
        this.dataForm.reality = ''
        this.dataForm.give = ''
        this.$message({
          type: 'error',
          duration: '5000',
          message: `提示: 实际的收费金额应 ≥ 挂号费!`
        })
      }
    },
    // 表单提交
    dataFormSubmitA () {
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
            RegisterStatus: 2, // 上面两个费用的支付状态，（默）1未支付 2已支付； 这儿的页面是前台挂号的嘛，99.99%都是已支付才挂号的所以直接一个2

            PaymentWay: this.dataForm.PaymentWay,
            Remark: this.dataForm.PaymentWay
          }
          console.log(params)
          API.register.registerSubmit(params).then(result => {
            if (result.code === '0000') {
              this.$message({
                message: `${'挂号成功'}`,
                type: 'success',
                duration: 3000
              })
              this.visible = false
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
