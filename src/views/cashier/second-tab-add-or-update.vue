<template>
  <el-dialog
    v-dialogDrag
    :title="'划价收费'" :width="'615px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose" class="charge-info">
    <div style="width: 580px">
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
        <el-col :span="8">科室：{{registerAllData.DepartmentTypeName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span style="display: inline-block;width: 70px;vertical-align: bottom;">诊断结果：</span>
          <span style="display: inline-block;width: 83%;vertical-align: bottom;min-height: 20px;border-bottom: 1px solid #333;">{{registerAllData.DiseaseInfo}}</span>
        </el-col>
      </el-row>

      <!--循环-->
      <el-row style="margin: 5px 0">
        <!--<el-col :span="12" style="font-size: 16px;">RP：[{{registerAllData.StatusName}}]</el-col>-->
        <el-col :span="12" v-if="registerAllData.SaleOrderItems">RP：{{registerAllData.SaleOrderItems[0].CategoryName.substring(4)}}</el-col>
        <el-col :span="12" style="text-align: right;padding-right: 15px">{{registerAllData.SaleOrderItems ? registerAllData.SaleOrderItems.length : ''}} 味</el-col>
      </el-row>
      <el-row style="text-align: center;min-height: 260px;border-bottom: 1px solid #333;position: relative">
        <el-col :span="8" v-for="item in registerAllData.SaleOrderItems" :key="item.ProductId">
          <span style="display: inline-block;width: 70px;text-align: right">{{item.ProductName}}</span>
          <span style="display: inline-block;width: 70px;text-align: left">{{item.RefundableQty}} {{item.Unit}}</span>
        </el-col>
        <i style="position: absolute;right: 33%;bottom: 50%;transform: rotate(-23deg);border: 2px solid #e4393c;box-shadow: 0 0 10px 1px #e4393c;
                  color: #e4393c;font-size: 30px;padding: 10px 10px;border-radius: 30px;opacity: .9">{{registerAllData.OrderAmount}}元，已收款</i>
      </el-row>

      <!--footer height: 30px;line-height: 30px-->
      <el-row style="">
        <el-row style="height: 30px;line-height: 30px">
          <el-col :span="24">帖数：一剂 ￥{{registerAllData.TotalAmount}}，共 {{registerAllData.Total}} 剂，订单总金额 ￥{{registerAllData.OrderAmount}}</el-col>
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
              <!--<span style="display: inline-block;width: 76%;vertical-align: bottom;min-height: 20px;">先吃饭后吃药，加点水不放糖，水温50°，好好睡觉不要打游戏，不听的话你又要来看我</span>-->
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
    </div>

    <div style="text-align: right">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dataFormSubmitA()">打印</el-button>
        <el-button @click="visible = false">关闭</el-button>
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
      addOrUpdateVisible: false, // 暂时没用
      isAddActive: true,

      registerAllData: '', // 挂号单全部信息
      regMoney: /^\d+\.?\d{0,2}$/,
      dataForm: {
        reality: '', // 实收
        give: '', // 找零
        PaymentWay: 1 // 支付方式
      }
    }
  },
  watch: {
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
      if (Number(newval) < this.registerAllData.OrderAmount) { // 这：实收小于总金额就退出，然后呢应该还需要清空错误的输入和错误提示吧，其实搭配了下面的realityBlur方法的，别看漏了，我自己也懵逼
        return false
      } else {
        this.dataForm.give = Math.round((newval - this.registerAllData.OrderAmount) * 100) / 100 // 保留小数后两位
      }
    }
  },
  methods: {
    realityBlur() {
      if (Number(this.dataForm.reality) < this.registerAllData.OrderAmount) {
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
    init(formId) {
      if (formId) {
        this.visible = true
        this.dataListLoading = true
        API.register.getRegisterInfo({id: formId}).then(result => {
          if (result.code === '0000') {
            result.data.BirthDate = calcAge(result.data.BirthDate)
            this.registerAllData = result.data
            this.dataListLoading = false
            // console.log('查看', result.data)
          }
        })
      }
    },
    seeRecipelInfo() {
      this.isAddActive = !this.isAddActive // 点击'[添加药材]'按钮
    },
    handleClose() {
      this.isAddActive = true
      this.dataForm = {
        reality: '', // 实收
        give: '', // 找零
        PaymentWay: 1 // 支付方式
      }
    },
    // 收银提交接口
    dataFormSubmitA() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dataForm.reality === 0 && this.registerAllData.OrderAmount > 0) {
            this.$alert('实收金额未填! ', '提示', {
              confirmButtonText: '确定'
            })
            return false
          }
          var params = {
            // id: this.registerAllData.Id,
            // PaymentWay: this.dataForm.PaymentWay, // 支付方式
            // ActualAmount: this.registerAllData.OrderAmount // 实收金额 this.dataForm.reality 不是这个
          }
          console.log(params)
          API.register.cashierSubmit(params).then(result => {
            if (result.code === '0000') {
              this.$message({
                message: `${'提交成功'}`,
                type: 'success',
                duration: 1500
              })
              this.visible = false
            } else {
              this.$message.error(result.message)
            }
          })
        } else {
          this.$alert('实收金额未填! ', '提示', {
            confirmButtonText: '确定'
          })
        }
      })
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
