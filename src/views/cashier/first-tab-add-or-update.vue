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
          <el-col :span="18" v-if="registerAllData.SaleOrderItems">
            RP：{{registerAllData.SaleOrderItems[0].CategoryName.substring(4)}}
            一剂 {{registerAllData.SaleOrderItems.map(item => item.Quantity).reduce((pren, nextm) => pren + nextm)}} g，
            {{registerAllData.Total}}剂共 {{registerAllData.Total * registerAllData.SaleOrderItems.map(item => item.Quantity).reduce((pren, nextm) => pren + nextm)}} g，
            加工费{{registerAllData.WorkAmount}}
          </el-col>
          <el-col :span="6" style="text-align: right;padding-right: 15px">{{registerAllData.SaleOrderItems ? registerAllData.SaleOrderItems.length : ''}} 味</el-col>
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
            <el-col :span="24">帖数：一剂 ￥{{registerAllData.DrugOneAmount}}，共 {{registerAllData.Total}} 剂，订单总价 ￥{{registerAllData.OrderAmount}}</el-col>
          </el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <span style="display: inline-block;width: 17%;vertical-align: top;">用法：</span>
                <!--<span style="display: inline-block;width: 81%;vertical-align: bottom;min-height: 20px;">先吃饭后吃药，加点水不放糖，水温50°，好好睡觉不要打游戏，不听的话你又要来看我</span>-->
                <span style="display: inline-block;width: 81%;vertical-align: bottom;min-height: 20px;">{{registerAllData.DrugRate}}</span>
              </el-col>
              <el-col :span="24">
                <span style="display: inline-block;width: 17%;vertical-align: top;">医嘱：</span>
                <!--<span style="display: inline-block;width: 81%;vertical-align: bottom;min-height: 20px;">先吃饭后吃药，加点水不放糖，水温50°，好好睡觉不要打游戏，不听的话你又要来看我</span>-->
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
            <tr>
              <td>挂号费</td>
              <td colspan="2"><p>￥{{registerAllData.RegisterAmount}}
                <span style="display: inline-block;width: 200px;text-align: right"></span></p></td>
            </tr>
            <tr>
              <td>药品费</td>
              <td colspan="2"><p>￥{{registerAllData.TotalAmount}}
                <span style="display: inline-block;width: 200px;text-align: right"></span></p></td>
            </tr>
            <tr valign="bottom">
              <td height="30"></td>
              <td colspan="2"><p>
                <span style="display: inline-block;width: 210px;text-align: right">{{registerAllData.PaymentWayName}}</span></p></td>
            </tr>

            <tr>
              <td colspan="1">合计：￥{{registerAllData.TotalAmount + registerAllData.RegisterAmount}}</td>
              <td colspan="2"><p>大写：{{sumChinese(registerAllData.RegisterAmount)}}</p></td>
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
              <el-form-item label="折扣">
                <el-input-number v-model="percentage" :min="1" :max="100" style="width: 95px"></el-input-number>
              </el-form-item>%
            </el-col>
          </el-row>

          <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 40px;line-height: 40px;clear: both">
            <el-col :span="8">
              <el-tooltip placement="left" effect="light">
                <div slot="content">加工费：<br/><br/>只针对制膏、制丸</div>
                <el-form-item label="加工费">
                  <el-input-number v-model="registerAllData.WorkAmount" :min="0" :max="1000" style="width: 100px"></el-input-number>
                </el-form-item>
              </el-tooltip>
            </el-col>
            <el-col :span="8">待收费</el-col>
            <el-col :span="8">- -</el-col>
          </el-row>
          <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 40px;line-height: 40px;clear: both">
            <el-col :span="8">
              <el-form-item label="代煎">
                <el-input-number v-model="daijian" :min="0" :max="1000" style="width: 100px"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">待收费</el-col>
            <el-col :span="8">- -</el-col>
          </el-row>

          <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 40px;line-height: 40px;clear: both">
            <el-col :span="8">
              <el-form-item label="快递">
                <el-input-number v-model="kuaidi" :min="0" :max="1000" style="width: 100px"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">待收费</el-col>
            <el-col :span="8">- -</el-col>
          </el-row>
          <el-row style="text-align: center;border-bottom: 1px solid #ccc; height: 40px;line-height: 40px;clear: both">
            <el-col :span="8">
              <el-form-item label="其他">
                <el-input-number v-model="qita" :max="1000" style="width: 100px"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="8">待收费</el-col>
            <el-col :span="8">- -</el-col>
          </el-row>

          <el-row>
            <el-col :span="24" style="margin-top: 10px">
              <el-form-item label="最终合计">
                <el-input v-model="registerAllData.TotalAmount" style="width: 100px" disabled></el-input> ￥
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" style="margin-bottom: 10px">
              <el-form-item label="支付方式"><!--患者支付方式-->
                <el-select v-model="dataForm.PaymentWay" style="width: 100px" placeholder="支付方式">
                  <el-option v-for="item in optionsPaymentType" :key="item.value"
                             :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实收">
                <el-input @blur="realityBlur" v-model="dataForm.reality" style="width: 100px" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
      <!--<el-col :span="8">-->
        <!--<el-form-item label="找零" prop="give">-->
          <!--<el-input v-model="dataForm.give" style="width: 100px" clearable size="small" disabled></el-input>-->
        <!--</el-form-item>-->
      <!--</el-col>-->
    </el-container>

    <div style="text-align: right">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dataFormSubmitA()">确认收费并打印</el-button>
        <el-button type="primary" @click="chenxiPrint()">打印</el-button>
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

      registerAllData: '', // 挂号单全部信息
      regMoney: /^\d+\.?\d{0,2}$/,
      dataForm: {
        reality: '', // 实收
        give: '', // 找零
        PaymentWay: 1 // 支付方式
      },
      dataRule: {},// reality: Currency('此为必填项')
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
        }
      ],
      percentage: 100, // 打折参数
      daijian: 0,
      jiagongfei: 0,
      kuaidi: 0,
      qita: 0,
      // 残留的价格，挂号费已支付未支付的状态会影响这个值去 ± OerderAmount(2表示挂号费已支付，1表示未支付)
      residualPrice: 0 // 2019.06.01 新增字段，优化代码
    }
  },
  watch: {
    'dataForm.reality': function (newval, oldval) {
      console.log(this.residualPrice)
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
      if (Number(newval) < this.residualPrice) { // 这：实收小于总金额就退出，然后呢应该还需要清空错误的输入和错误提示吧，其实搭配了下面的realityBlur方法的，别看漏了，我自己也懵逼
        return false
      } else {
        this.dataForm.give = Math.round((newval - this.residualPrice) * 100) / 100 // 保留小数后两位
      }
    }
  },
  methods: {
    realityBlur () {
      if (Number(this.dataForm.reality) < this.residualPrice) {
        this.dataForm.reality = ''
        this.dataForm.give = ''
        this.$message({
          type: 'warning',
          duration: '5000',
          message: `提示: 实际的收费金额应 ≥ 挂号费!`
        })
      }
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
            this.dataListLoading = false
            console.log('查看', result.data)

            // 2019.06.01 残留的价格，挂号费已支付未支付的状态会影响这个值去 ± OerderAmount(2表示挂号费已支付，1表示未支付)
            if (this.registerAllData.RegisterStatus === 2) {
              this.residualPrice = Number((this.registerAllData.OrderAmount - this.registerAllData.RegisterAmount - this.registerAllData.ConsultationAmount).toFixed(2))
            } else if (this.registerAllData.RegisterStatus === 1) {
              this.residualPrice = this.registerAllData.OrderAmount
            }
            console.log(this.residualPrice)
          }
        })
      }
    },
    seeRecipelInfo () {
      this.isAddActive = !this.isAddActive // 点击'[添加药材]'按钮
    },
    handleClose () {
      this.isAddActive = true
      this.dataForm = {
        reality: '', // 实收
        give: '', // 找零
        PaymentWay: 1 // 支付方式
      }
    },
    // 收银提交接口
    dataFormSubmitA () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // if (this.dataForm.reality === 0 && this.residualPrice > 0) {
          //   this.$alert('实收金额未填! ', '提示', {
          //     confirmButtonText: '确定'
          //   })
          //   return false
          // }
          // var params = {
          //   id: this.registerAllData.Id,
          //   PaymentWay: this.dataForm.PaymentWay, // 支付方式
          //   ActualAmount: this.residualPrice // 实收金额 this.dataForm.reality 不是这个
          // }
          // console.log(params)
          // API.register.cashierSubmit(params).then(result => {
          //   if (result.code === '0000') {
          //     this.$message({
          //       message: `${'提交成功'}`,
          //       type: 'success',
          //       duration: 1500,
          //       onClose: () => {
          //         this.visible = false
          //         this.$emit('refreshDataList')
          //       }
          //     })
          //   } else {
          //     this.$message.error(result.message)
          //   }
          // })
          this.chenxiPrint() // 提交后打印
        } else {
          this.$alert('实收金额未填! ', '提示', {
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
      // var myPrint = document.getElementById('chenxiPrint').innerHTML
      // // console.log(myPrint)
      // var bodyHTML = document.body.innerHTML
      // window.document.body.innerHTML = myPrint
      // window.print()
      // window.document.body.innerHTML = bodyHTML
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
.ownScrollbar /deep/ {
  /*span {*/
    /*display: inline-block;*/
    /*width: 70px;*/
    /*text-align: right;*/
    /*height: 30px;*/
    /*line-height: 30px;*/
  /*}*/
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
