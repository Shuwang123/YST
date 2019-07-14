<template>
  <el-dialog
    v-dialogDrag
    :title="'划价收费'" :width="isAddActive === false ? '650px' : '1190px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose" class="charge-info">
    <el-container>

      <el-aside v-if="isAddActive"  :width="isAddActive === false ? '100%' : '47%'" style="padding: 0 15px !important;border-right: 1px solid #ccc">
        <el-row>
          <el-col :span="12">
            <!-- style="border-bottom: 1px solid #333;"-->
            <p>处方编号：<span v-text="registerAllData.Code"></span></p>
          </el-col>
          <el-col :span="12" style="text-align: right;padding-right: 10px">
            <p>订单时间：<span v-text="registerAllData.CreatedOnTime"></span></p>
          </el-col>
        </el-row>
        <!--header-->
        <el-row style="text-align: left;font-size: 20px;margin: 20px 0"><el-col :span="24"><b>{{registerAllData.StoreName}}处方笺</b></el-col></el-row>
        <el-row>
          <el-col :span="16">患者信息：{{registerAllData.UserName}} {{registerAllData.SexName ? registerAllData.SexName : '__'}} {{registerAllData.BirthDate}}</el-col>
          <!--<el-col :span="8">科室：{{registerAllData.DepartmentTypeName}}</el-col>-->
        </el-row>
        <el-row>
          <el-col :span="24">
            <span style="display: inline-block;width: 70px;vertical-align: bottom;">诊断结果：</span>
            <span style="display: inline-block;width: 83%;vertical-align: bottom;min-height: 20px;border-bottom: 1px solid #333;">{{registerAllData.DiseaseInfo}}</span>
          </el-col>
        </el-row>

        <!--循环-->
        <el-row style="margin: 5px 0">
          <!--<el-col :span="12" style="font-size: 16px;">RP：[{{registerAllData.StatusName}}]</el-col> 下面行写了个vif，控制台报错找不0属性，后来加了v-if-->
          <!--1 剂 {{registerAllData.SaleOrderItems.map(item => item.Quantity).reduce((pren, nextm) => pren + nextm)}} g，-->
          <el-col :span="18" v-if="registerAllData.SaleOrderItems">
            RP：[{{registerAllData.CategoryOneName}}] - [{{registerAllData.SaleOrderItems[0].CategoryName.substring(4)}}]
          </el-col>
          <el-col :span="6" v-if="registerAllData.SaleOrderItems" style="text-align: right;padding-right: 15px">
            {{registerAllData.SaleOrderItems ? registerAllData.SaleOrderItems.length : ''}} 味,
            总计 {{registerAllData.Total * registerAllData.SaleOrderItems.map(item => item.Quantity).reduce((pren, nextm) => pren + nextm)}} g
          </el-col>
        </el-row>
        <el-row style="text-align: center;min-height: 260px;border-bottom: 1px solid #333;">
          <el-col :span="8" v-for="item in registerAllData.SaleOrderItems" :key="item.ProductId">
            <span style="display: inline-block;width: 70px;text-align: right">{{item.ProductName}}</span>
            <span style="display: inline-block;width: 70px;text-align: left">{{item.RefundableQty}} {{item.Unit}}</span>
          </el-col>
        </el-row>

        <!--footer height: 30px;line-height: 30px-->
        <el-row style="">
          <el-row style="height: 30px;line-height: 30px">
            <el-col :span="24">帖数：共 {{registerAllData.Total}} 剂，订单总价 ￥{{registerAllData.TotalAmount}}</el-col>
          </el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <span style="display: inline-block;width: 17%;vertical-align: top;">用法：</span>
                <span style="display: inline-block;width: 81%;vertical-align: bottom;min-height: 20px;">{{registerAllData.DrugRate}}</span>
              </el-col>
              <el-col :span="24">
                <span style="display: inline-block;width: 17%;vertical-align: top;">医嘱：</span>
                <span style="display: inline-block;width: 81%;vertical-align: bottom;min-height: 20px;">{{registerAllData.DoctorAdvice}}</span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-row>
              <el-col :span="24">收货人：{{registerAllData.UserName}} {{registerAllData.MobilePhone}}</el-col>
              <el-col :span="24">
                <span style="display: inline-block;width: 20%;vertical-align: top;">地址：</span>
                <span style="display: inline-block;width: 76%;vertical-align: bottom;min-height: 20px;">{{registerAllData.Address}}</span>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="6">医生：{{registerAllData.DoctorName}}</el-col>
          <el-col :span="6">审核：</el-col>
          <el-col :span="6">调配：</el-col>
          <el-col :span="6">核发：</el-col>
        </el-row>

        <!--打印层-->
        <!--打印层-->
        <!--打印层-->
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
            <!--已收取挂号费的不需要药打印挂号费-->
            <tr v-show="registerAllData.RegisterStatus === 1">
              <td>挂号费</td>
              <td colspan="2"><p>￥{{registerAllData.RegisterAmount}}
                <span style="display: inline-block;width: 200px;text-align: right"></span></p></td>
            </tr>
            <tr>
              <td>药品费</td>
              <td colspan="2"><p>￥{{(registerAllData.TotalAmount - registerAllData.RegisterAmount).toFixed(2)}}
                <span style="display: inline-block;width: 200px;text-align: right"></span></p></td>
            </tr>
            <tr valign="bottom">
              <td height="30"></td>
              <td colspan="2"><p>
                <span style="display: inline-block;width: 100%;text-align: right;padding-right: 19px">
                  {{optionsPaymentType.filter(item => { return item.value === dataForm.PaymentWay})[0].label}}</span></p>
              </td>
            </tr>

            <tr>
              <td colspan="1">合计：￥{{registerAllData.TotalAmount}}</td>
              <td colspan="2"><p>大写：{{sumChinese(registerAllData.TotalAmount)}}</p></td>
            </tr>
            <tr>
              <td colspan="3">需开发票请于15日内开具，逾期不补! </td>
            </tr>
            <tr>
              <td colspan="3">收费人员：{{$store.getters.getAccountLoginInfoAll.NickName}}</td>
            </tr>
            </tbody>
          </table>
        </div>

      </el-aside>

      <el-main class="ownScrollbar" style="min-height: 390px;overflow-y: scroll;" v-loading="dataListLoading">
        <el-row>
          <el-col :span="24">病历号：{{registerAllData.UserCode}}</el-col>
        </el-row>
        <el-row>
          <el-col><div style="padding-top: 5px;font-size: 16px;font-weight: 900;color: #1CA579">收费项目：</div></el-col>
        </el-row>

        <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="70px" size="mini" :inline="true">
          <!--头行-->
          <el-row style="text-align: center; font-weight: 700; border-bottom: 1px solid #ccc;border-top: 1px solid #ccc;height: 40px;line-height: 40px">
            <el-col :span="8">收费项目</el-col>
            <el-col :span="8">状态</el-col>
            <el-col :span="8">操作</el-col>
          </el-row>
          <div class="collect">
            <!--收费项目详情-->
            <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 40px;line-height: 40px;clear: both">
              <el-col :span="8">
                <el-form-item label="挂号费">
                  <el-input v-model="registerAllData.RegisterAmount" style="width: 100px" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">{{registerAllData.RegisterStatusName ? registerAllData.RegisterStatusName : '无'}}</el-col>
              <el-col :span="8">- -</el-col>
            </el-row>
            <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 40px;line-height: 40px;clear: both">
              <el-col :span="8">
                <el-form-item label="药品费">
                  <el-input v-model="registerAllData.DrugTotalAmount" style="width: 100px" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">{{registerAllData.StatusName ? registerAllData.StatusName : '无'}}</el-col>
              <el-col :span="8">
                <el-form-item label="折扣" prop="percentage">
                  <el-input-number @change="myComputedAttr" v-model="dataForm.percentage" :min="1" :max="100" style="width: 95px"></el-input-number>
                </el-form-item>%
              </el-col>
            </el-row>

            <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 40px;line-height: 40px;clear: both">
              <el-col :span="8">
                <el-tooltip placement="left" effect="light">
                  <div slot="content">加工费：<br/><br/>只针对制膏、制丸</div>
                  <el-form-item label="加工费" prop="WorkAmount">
                    <el-input-number @change="myComputedAttr" v-model="dataForm.WorkAmount" :min="0" :max="1000" style="width: 100px"></el-input-number>
                  </el-form-item>
                </el-tooltip>
              </el-col>
              <el-col :span="8">待收费</el-col>
              <el-col :span="8">- -</el-col>
            </el-row>
            <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 40px;line-height: 40px;clear: both">
              <el-col :span="8">
                <el-form-item label="代煎" prop="DJAmount">
                  <el-input-number @change="myComputedAttr" v-model="dataForm.DJAmount" :min="0" :max="1000" style="width: 100px"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">待收费</el-col>
              <el-col :span="8">- -</el-col>
            </el-row>

            <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 40px;line-height: 40px;clear: both">
              <el-col :span="8">
                <el-form-item label="快递" prop="ExpressAmount">
                  <el-input-number @change="myComputedAttr" v-model="dataForm.ExpressAmount" :min="0" :max="1000" style="width: 100px"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">待收费</el-col>
              <el-col :span="8">- -</el-col>
            </el-row>
            <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 40px;line-height: 40px;clear: both">
              <el-col :span="8">
                <el-form-item label="其他" prop="OtherAmount">
                  <el-input-number @change="myComputedAttr" v-model="dataForm.OtherAmount" :max="1000" style="width: 100px"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">待收费</el-col>
              <el-col :span="8">- -</el-col>
            </el-row>
          </div>

          <el-row style="margin: 15px 0 10px">
            <el-col :span="24">
              患者总消费：￥{{mySumAmount}}，
              已支付：￥{{registerAllData.RegisterStatus === 2 ? registerAllData.RegisterAmount : '0'}}，
              <b style="color: #e4393c">待支付：￥{{myFutureAmount}}</b>
            </el-col>
          </el-row>
          <!--支付方式0-->
          <el-row>
            <el-col :span="9" style="margin-bottom: 10px">
              <el-form-item label="支付方式"><!--患者支付方式-->
                <el-select v-model="dataForm.PaymentWay" style="width: 100px" placeholder="支付方式">
                  <el-option v-for="item in optionsPaymentType" :key="item.value"
                             :label="item.label" :value="item.value" :disabled="item.abled"></el-option>
                </el-select>
              </el-form-item>
              <div style="display: inline-block;width: 16px;height: 16px;line-height: 16px;border-radius: 50%;
                   background-color: #0A96FE;text-align: center;color: #fff;margin-top: 7px;
                   cursor: pointer" @click="paymentAdd = !paymentAdd">
                {{paymentAdd === false ? '+' : '-'}}
              </div>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实收" prop="PayAmount">
                <el-input v-model="dataForm.PayAmount" style="width: 100px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!--支付方式1-->
          <el-row v-show="paymentAdd">
            <el-col :span="9" style="margin-bottom: 10px">
              <el-form-item label="支付方式"><!--患者支付方式-->
                <el-select v-model="dataForm.OnlinePaymentWay" style="width: 100px" placeholder="支付方式">
                  <el-option v-for="item in optionsPaymentType" :key="item.value"
                             :label="item.label" :value="item.value" :disabled="item.abled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实收" prop="OnlinePayAmount">
                <el-input v-model="dataForm.OnlinePayAmount" style="width: 100px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" :offset="9" style="margin-bottom: 10px">
              <el-form-item label="找零" prop="give">
                <el-input v-model="dataForm.give" style="width: 100px" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" style="text-align: right">
              <el-form-item label="推荐人">
                <el-input v-model="dataForm.PrescriptionName" style="width: 70px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
    </el-container>

    <div style="text-align: right">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dataFormSubmit()">确认收费并打印</el-button>
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import '../common/icon/iconfont.css'
import {calcAge, Currency} from '@/utils/validate'

export default {
  data () {
    return {
      visible: false,
      dataListLoading: false, // 加载
      addOrUpdateVisible: false, // 暂时没用
      isAddActive: true,
      regMoney: /^\d+\.?\d{0,2}$/,

      registerAllData: '', // 挂号单全部信息
      oldDrugTotalAmount: '', // 提前保存最初100%时候的药价
      mySumAmount: '', // 任意关联患者最终总消费变化的收费项改变后：都会更新这个值，尝试过计算属性，但为毛我的dialog洗白了
      myFutureAmount: '', // 同上，只不过这个是待收费的总金额

      dataForm: {
        percentage: 100, // 打折
        WorkAmount: 0, // 加工费
        DJAmount: 0, // 代煎费用
        ExpressAmount: 0, // 快递费
        OtherAmount: 0, // 其他

        PaymentWay: 1, // 支付方式
        OnlinePaymentWay: '', // 支付方式
        PayAmount: '', // 支付金额_0
        OnlinePayAmount: 0, // 支付金额_1

        give: '', // 找零
        PrescriptionName: '无' // 介绍人
      },
      dataRule: {
        percentage: Currency(' '),
        WorkAmount: Currency(' '),
        DJAmount: Currency(' '),
        ExpressAmount: Currency(' '),
        OtherAmount: Currency(' '),

        PayAmount: Currency(' '),
        OnlinePayAmount: Currency(' ')
      },
      paymentAdd: false, // 多种支付方式
      optionsPaymentType: [ // 支付类型
        {label: '现金', value: 1, abled: true},
        {label: '支付宝', value: 2},
        {label: '微信扫码', value: 3},
        {label: '银行卡', value: 4},
        {label: '医保', value: 5},
        {label: '微信客服手机', value: 6},
        {label: '代金券', value: 7},
        {label: '会员卡', value: 8}]
    }
  },
  watch: {
    // 折扣监听
    'dataForm.percentage': function (val, oldval) {
      this.registerAllData.DrugTotalAmount = Number(this.oldDrugTotalAmount * val / 100).toFixed(2)
    },
    // 支付方式监听
    'dataForm.PaymentWay': function (val, oldval) {
      this.optionsPaymentType.forEach(item => {
        if (val === item.value || this.dataForm.OnlinePaymentWay === item.value) {
          item.abled = true
        } else { item.abled = false }
      })
    },
    'dataForm.OnlinePaymentWay': function (val, oldval) {
      this.optionsPaymentType.forEach(item => {
        if (val === item.value || this.dataForm.PaymentWay === item.value) {
          item.abled = true
        } else { item.abled = false }
      })
    },
    // 实收监听
    'dataForm.PayAmount': function (val, oldval) {
      var sum = Number(val) + Number(this.dataForm.OnlinePayAmount)
      console.log(val, this.dataForm.OnlinePaymentWay, sum)
      if (Number(val) === 0 && String(val).length > 1) { // 000000 这种
        this.dataForm.PayAmount = ''
        return false
      }
      if (String(val).includes(' ').length) { // ____000 这种
        this.dataForm.PayAmount = ''
        return false
      }
      if (Number(val) !== 0 && !this.regMoney.test(val)) {
        this.$alert('请规范您的输入，不要乱填空格字母等奇怪符号! ', '输入提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.dataForm.PayAmount = ''
            this.dataForm.give = ''
            return false
          }
        })
      }
      if (sum < this.myFutureAmount) { // 这：监听时：实收小于待收金额就不用计算找零了，但还是需要清空错误的输入啊，比如‘    ’
        this.dataForm.give = ''
        return false
        // this.dataForm.give = Math.round((sum - this.registerAllData.TotalAmount) * 100) / 100 // 保留小数后两位
      } else {
        this.dataForm.give = Math.round((sum - this.myFutureAmount) * 100) / 100 // 保留小数后两位
      }
    },
    'dataForm.OnlinePayAmount': function (val, oldval) {
      var sum = Number(val) + Number(this.dataForm.PayAmount)
      console.log(this.dataForm.PaymentWay, val, sum)
      if (Number(val) === 0 && String(val).length > 1) { // 000000 这种
        this.dataForm.OnlinePayAmount = ''
        return false
      }
      if (String(val).includes(' ').length) { // ____000 这种
        this.dataForm.OnlinePayAmount = ''
        return false
      }
      if (Number(val) !== 0 && !this.regMoney.test(val)) {
        this.$alert('请规范您的输入，不要乱填空格字母等奇怪符号! ', '输入提示', {
          confirmButtonText: '确定',
          callback: () => {
            this.dataForm.OnlinePayAmount = ''
            this.dataForm.give = ''
            return false
          }
        })
      }
      if (sum < this.myFutureAmount) { // 这：监听时：实收小于待收金额就不用计算找零了，但还是需要清空错误的输入啊，比如‘    ’
        this.dataForm.give = ''
        return false
        // this.dataForm.give = Math.round((sum - this.registerAllData.TotalAmount) * 100) / 100 // 保留小数后两位
      } else {
        this.dataForm.give = Math.round((sum - this.myFutureAmount) * 100) / 100 // 保留小数后两位
      }
    }
  },
  methods: {
    myComputedAttr () {
      // 患者总消费
      this.mySumAmount = (this.registerAllData.RegisterAmount +
                          this.oldDrugTotalAmount * this.dataForm.percentage / 100 +
                          this.dataForm.WorkAmount + this.dataForm.DJAmount + this.dataForm.ExpressAmount + this.dataForm.OtherAmount).toFixed(2)
      // 待收金额
      if (this.registerAllData.RegisterStatus === 1) { // 挂号费未支付（直接开方）：待收金额就 + 挂号费
        this.myFutureAmount = this.mySumAmount
      } else if (this.registerAllData.RegisterStatus === 2) { // 挂号费已支付：待收金额就不加挂号费
        this.myFutureAmount = Number(this.mySumAmount - this.registerAllData.RegisterAmount).toFixed(2)
      }
      this.dataForm.PayAmount = ''
      this.dataForm.OnlinePayAmount = 0
      this.dataForm.give = ''
    },
    // 根据表单的Id，获取对应挂号单的详情
    init (formId) {
      if (formId) {
        this.visible = true
        this.dataListLoading = true
        API.register.getRegisterInfo({id: formId}).then(result => {
          if (result.code === '0000') {
            result.data.BirthDate = calcAge(result.data.BirthDate)
            this.registerAllData = result.data
            this.oldDrugTotalAmount = result.data.DrugTotalAmount
            this.dataForm.WorkAmount = result.data.WorkAmount
            this.dataListLoading = false
            console.log('查看', result.data)

            this.myComputedAttr() // 进入页面的时候计算一次：患者总消费金额、患者待支付金额；这之后只有相关的收费项改变时才会重新计算了，利用@change = myComputedAttr方法
          }
        })
      }
    },
    seeRecipelInfo () {
      this.isAddActive = !this.isAddActive // 点击'[添加药材]'按钮
    },
    handleClose () {
      this.isAddActive = true
      this.oldDrugTotalAmount = ''
      this.registerAllData = ''
      this.dataForm = {
        percentage: 100, // 打折
        WorkAmount: '', // 加工费
        DJAmount: 0, // 代煎费用
        ExpressAmount: 0, // 快递费
        OtherAmount: 0, // 其他

        PaymentWay: 1, // 支付方式
        OnlinePaymentWay: '', // 支付方式
        PayAmount: '', // 支付金额_0
        OnlinePayAmount: 0, // 支付金额_1

        give: '', // 找零
        PrescriptionName: '无' // 介绍人
      }
      this.paymentAdd = false
    },
    // 收银提交接口
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // var  Actual = Number(this.dataForm.PayAmount) + Number(this.dataForm.OnlinePayAmount)
          if (this.paymentAdd === true && this.dataForm.OnlinePaymentWay === '') {
            this.$alert('未选择支付方式! ', '提示', {confirmButtonText: '确定'})
            return false
          }
          if (this.paymentAdd === true) { // 表示多种支付方式
            if ((Number(this.dataForm.PayAmount) + Number(this.dataForm.OnlinePayAmount)) < Number(this.myFutureAmount)) {
              this.$alert('实收金额不够! ', '提示', {confirmButtonText: '确定'})
              return false
            }
            if (Number(this.dataForm.PayAmount) >= Number(this.myFutureAmount)) {
              this.dataForm.PayAmount = this.myFutureAmount
              this.dataForm.OnlinePayAmount = 0
            } else {
              this.dataForm.PayAmount = this.dataForm.PayAmount
              this.dataForm.OnlinePayAmount = Number(this.myFutureAmount - this.dataForm.PayAmount).toFixed(2)
            }
          } else { // 表示单种支付方式
            if (Number(this.dataForm.PayAmount) < Number(this.myFutureAmount)) {
              this.$alert('实收金额不够! ', '提示', {confirmButtonText: '确定'})
              return false
            }
            if (Number(this.dataForm.PayAmount) >= Number(this.myFutureAmount)) {
              this.dataForm.PayAmount = this.myFutureAmount
              this.dataForm.OnlinePaymentWay = '' // 支付方式
              this.dataForm.OnlinePayAmount = 0
            }
          }
          var  Actual = Number(this.dataForm.PayAmount) + Number(this.dataForm.OnlinePayAmount)
          var params = {
            id: this.registerAllData.Id,
            ActualAmount: Actual, // 实收废弃???
            PaymentWay: this.dataForm.PaymentWay, // 支付方式
            OnlinePaymentWay: this.dataForm.OnlinePaymentWay, // 支付方式
            PayAmount: this.dataForm.PayAmount, // 实收金额
            OnlinePayAmount: this.dataForm.OnlinePayAmount, // 实收金额

            Discount: (this.dataForm.percentage / 100).toFixed(2), // 折扣 保留两位小数
            WorkAmount: this.dataForm.WorkAmount, // 加工费
            DJAmount: this.dataForm.DJAmount, // 代煎费用
            ExpressAmount: this.dataForm.ExpressAmount, // 快递费
            OtherAmount: this.dataForm.OtherAmount, // 其他费用
            IntroducePeople: this.dataForm.PrescriptionName // 其他费用
          }
          console.log(params)
          API.register.cashierSubmit(params).then(result => {
            if (result.code === '0000') {
              this.$message({
                message: `${'提交成功'}`,
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(result.message)
            }
          })
          this.chenxiPrint() // 提交后打印
        } else {
          this.$alert('请检查是否有必填项未填写! ', '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },
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
    }

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.charge-info /deep/ .el-form-item {
  margin-bottom: 0;
}
.collect /deep/ {
  .el-form-item--mini .el-form-item__label {
    margin-top: -15px;
  }
  .el-form-item {
    position: relative;
    top: 6px;
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
