<template>
  <el-dialog
    v-dialogDrag
    :title="'已开处方'" :width="'615px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose" class="charge-info">
    <div style="width: 580px" v-loading="dataListLoading">
      <el-row>
        <el-col :span="12">
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
      <el-row style="text-align: center;min-height: 260px;border-bottom: 1px solid #333;position: relative">
        <el-col :span="8" v-for="item in registerAllData.SaleOrderItems" :key="item.ProductId">
          <span style="display: inline-block;width: 70px;text-align: right;
          overflow: hidden;white-space: nowrap; text-overflow: ellipsis;vertical-align: bottom">
            {{item.ProductName}}
          </span>
          <span style="display: inline-block;width: 70px;text-align: left">
            {{item.RefundableQty}} {{item.Unit}} {{item.CategoryId === 1002 ? '[精]' : ''}}{{item.CategoryId === 1005 ? '[贵]' : ''}}
          </span>
        </el-col>
      </el-row>

      <!--footer height: 30px;line-height: 30px-->
      <el-row>
        <el-row style="height: 30px;line-height: 30px">
          <el-col :span="24">帖数：共 {{registerAllData.Total}} 剂，订单总价 ￥{{Number(registerAllData.TotalAmount).toFixed(2)}}</el-col>
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

    <!--打印层: 药方--><!--标准A5-->
    <div id="printRecipel" style="display: none">
      <!--<div id="printRecipel">-->
      <table width="100%" style="font-size: 12px">

        <!--头部-->
        <tbody>
        <tr>
          <td>处方编号：<span v-text="registerAllData.Code"></span></td>
          <td colspan="2" align="right">订单时间：<span v-text="registerAllData.CreatedOnTime"></span></td>
        </tr>
        <tr>
          <td height="50" style="font-size: 20px;margin: 20px 0"><b>{{registerAllData.StoreName}}的处方笺-未支付</b></td>
        </tr>
        <tr height="26">
          <td>患者信息：{{registerAllData.UserName}} {{registerAllData.SexName ? registerAllData.SexName : '__'}} {{registerAllData.BirthDate}}</td>
          <td width="50%">
            <!--<p style="padding-left: 70px">科室：<span>{{registerAllData.DepartmentTypeName}}</span></p>-->
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <div style="position: relative;margin-left: 60px;border-bottom: 1px solid #333">
              <span style="position: absolute;bottom: 0;left: -60px; width: 60px">诊断结果：</span>
              <p style="margin-bottom: 3px;min-height: 20px">{{registerAllData.DiseaseInfo}}</p>
            </div>
          </td>
        </tr>
        <tr>
          <td v-if="registerAllData.SaleOrderItems">RP：[{{registerAllData.CategoryOneName}}] - [{{registerAllData.SaleOrderItems[0].CategoryName.substring(4)}}]</td>
          <td align="right" height="26">{{registerAllData.SaleOrderItems ? registerAllData.SaleOrderItems.length : ''}} 味</td>
        </tr>
        </tbody>

        <!--药材列表loop-->
        <tbody>
        <tr>
          <td colspan="2">
            <ul style="list-style-type: none;padding: 0;margin: 0;min-height: 260px;border-bottom: 1px solid #333;">
              <li v-for="item in registerAllData.SaleOrderItems" :key="item.ProductId"
                  style="float: left;width: 33%;text-align: center;height: 24px;line-height: 24px">
                  <span style="display: inline-block;width:100px;text-align: right;
                  overflow: hidden;white-space: nowrap; text-overflow: ellipsis;vertical-align: bottom">
              {{item.ProductName}}
            </span>
                <span style="display: inline-block;width: 65px;text-align: left">
              {{item.RefundableQty}} {{item.Unit}} {{item.CategoryId === 1002 ? '[精]' : ''}}{{item.CategoryId === 1005 ? '[贵]' : ''}}
            </span>

              </li>
            </ul>
          </td>
        </tr>
        </tbody>

        <!--底部-->
        <tbody>
        <tr>
          <td colspan="2" height="26">
            <div style="position: relative;margin-left: 36px">
              <span style="position: absolute;bottom: 0;left: -36px; width: 36px">帖数：</span>
              <p>共 {{registerAllData.Total}} 剂，订单总价 ￥{{Number(registerAllData.TotalAmount).toFixed(2)}}</p>

            </div>
          </td>
        </tr>
        <tr valign="top">
          <td width="48%">
            <div style="position: relative;margin-left: 36px">
              <span style="position: absolute;top: 0;left: -36px; width: 36px">用法：</span>
              <p style="min-height: 24px">{{registerAllData.DrugRate}}</p>
            </div>
          </td>
          <td width="48%" style="margin-left: 4%">
            <div style="position: relative;margin-left: 98px">
              <span style="position: absolute;top: 0;left: -48px; width: 48px">收货人：</span>
              <p style="min-height: 24px">{{registerAllData.UserName}} {{registerAllData.MobilePhone}}</p>
            </div>
          </td>
        </tr>
        <tr valign="top">
          <td width="48%" height="24">
            <div style="position: relative;margin-left: 36px">
              <span style="position: absolute;top: 0;left: -36px; width: 36px">医嘱：</span>
              <p style="min-height: 24px">{{registerAllData.DoctorAdvice}}</p>
            </div>
          </td>
          <td width="48%" style="margin-left: 4%">
            <div style="position: relative;margin-left: 96px">
              <span style="position: absolute;top: 0;left: -36px; width: 36px">地址：</span>
              <p style="min-height: 24px">{{registerAllData.Address}}</p>
            </div>
          </td>
        </tr>
        <tr>

          <!--签字-->
        <tr>
          <td height="26">医生：<span v-text="registerAllData.DoctorName"></span></td>
          <td colspan="2"><p style="padding-left: 50px">审核：<span></span></p></td>
        </tr>
        <tr>
          <td height="26">调配：<span></span></td>
          <td colspan="2"><p style="padding-left: 50px">核发：<span></span></p></td>
        </tr>
        </tbody>
      </table>
    </div>

    <div style="text-align: right">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chenxiPrint('printRecipel')">药方</el-button>
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

      registerAllData: '' // 挂号单全部信息
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
    // 打印功能
    chenxiPrint (printType) {
      var idName = ''
      switch (printType) {
        case 'printRecipel':
          idName = 'printRecipel'
          break
        case 'printCashier':
          idName = 'printCashier'
          break
        case 'printOutStock':
          idName = 'printOutStock'
          break
      }
      var printHTML = document.getElementById(idName).innerHTML // 获取要打印的内容
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
    handleClose () {
      this.dataForm = {
        reality: '', // 实收
        give: '', // 找零
        PaymentWay: 1 // 支付方式
      }
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
