<template>
  <el-dialog
    v-dialogDrag
    :title="'划价收费'" :width="'615px'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="handleClose" class="charge-info">
    <div style="width: 580px" v-loading="dataListLoading">
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
      <el-row style="text-align: center;min-height: 260px;border-bottom: 1px solid #333;position: relative">
        <el-col :span="8" v-for="item in registerAllData.SaleOrderItems" :key="item.ProductId">
          <span style="display: inline-block;width: 70px;text-align: right">{{item.ProductName}}</span>
          <span style="display: inline-block;width: 70px;text-align: left">
            {{item.RefundableQty}} {{item.Unit}} {{item.CategoryId === 1002 ? '[精]' : ''}}
          </span>
        </el-col>
      </el-row>

      <!--footer height: 30px;line-height: 30px-->
      <el-row>
        <el-row style="height: 30px;line-height: 30px">
          <el-col :span="24">帖数：共 {{registerAllData.Total}} 剂，订单总价 ￥{{registerAllData.TotalAmount}}</el-col>
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
            <td height="50" style="font-size: 20px;margin: 20px 0"><b>{{registerAllData.StoreName}}的处方笺</b></td>
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
                  <span style="display: inline-block;width: 70px;text-align: right;margin-right: 5px">{{item.ProductName}}</span>
                  <span style="display: inline-block;">{{item.RefundableQty}}</span> {{item.Unit}} {{item.CategoryId === 1002 ? '[精]' : ''}}
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
                <p>共 {{registerAllData.Total}} 剂，订单总价 ￥{{registerAllData.TotalAmount}}</p>

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

      <!--打印层：收银小票补打--><!--12.00：9.31cm-->
      <div id="printCashier" style="display: none">
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
            <td colspan="2"><p>￥{{registerAllData.TotalAmount - registerAllData.RegisterAmount}}
              <span style="display: inline-block;width: 200px;text-align: right"></span></p></td>
          </tr>
          <tr valign="bottom">
            <td height="30"></td>
            <td colspan="2"><p>
              <span style="display: inline-block;width: 210px;text-align: right">{{registerAllData.PaymentWayName}}</span></p></td>
          </tr>

          <tr>
            <td colspan="1">合计：￥{{registerAllData.TotalAmount}}</td>
            <td colspan="2"><p>大写：{{sumChinese(registerAllData.TotalAmount)}}</p></td>
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

      <!--打印层：财务出库单）--><!--包装盒24.10(实际设置用的24.1-2.6约等于21.7cm的宽)：9.31cm-->
      <div id="printOutStock" v-if="registerAllData !== ''" style="display: none">
        <div v-for="index in pages" :key="index" style="font-size: 12px; width: 100%"> <!-- 循环开始 -->
          <div>
            <div style="text-align: center;font-size: 18px;font-weight: 900">重庆渝北一善堂中医门诊部（出库单）</div>
            <div>
              <div style="display: inline-block;width: 30%;text-align: left">供货企业：{{registerAllData.DoctorName}}</div>
              <div style="display: inline-block;width: 25%;text-align: right" v-if="registerAllData.CreatedOn">出库时间：{{registerAllData.CreatedOn | myDateFilter('yyyy-MM-dd')}}</div>
              <div style="display: inline-block;width: 40%;text-align: right">单据编号：{{registerAllData.Code}}</div>
            </div>
          </div>
          <table border="1" style="border-collapse: collapse;border-sizing: border-box" width="100%">
            <tbody style="text-align: center;line-height: 16px">
            <tr style="font-size: 12px">
              <td height="16"><p>排序</p></td>
              <td>商品编码</td>
              <td>商品名称</td>
              <td>规格</td>
              <td>生成厂家</td>

              <td>单位</td>
              <td>数量</td>
              <td>售价</td>
              <td>金额</td>
              <td>批号</td>
            </tr>
            <tr  style="font-size: 12px" v-for="(item, ind) in registerAllData.SaleOrderItems.slice((index - 1) * 10, (index * 10))" :key="item.ProductCode">
              <td width="50" height="16">{{ind + (index - 1) * 10 + 1}}</td>
              <td width="70">{{item.ProductCode}}</td>
              <td width="100" align="center"><p style="width: 100px;margin: 0 5px;white-space: nowrap;overflow: hidden;">{{item.ProductName}}{{item.CategoryId === 1002 ? '[精]' : ''}}</p></td>
              <td width="70" align="center"><p style="width: 70px;margin: 0 5px;white-space: nowrap;overflow: hidden;">{{item.Specification}}</p></td>
              <td width="100" align="center"><p style="width: 100px;margin: 0 5px;white-space: nowrap;overflow: hidden;">{{registerAllData.DoctorName}}</p></td>

              <td width="50">{{item.Unit}}</td>
              <td width="70">{{item.Quantity}}</td>
              <td width="70">{{item.SalePrice.toFixed(2)}}</td>
              <td width="70">{{(item.Quantity * item.SalePrice).toFixed(2)}}</td>
              <td width="100" align="center"><p style="width: 100px;white-space: nowrap;overflow: hidden;">{{item.ProductCode}}</p></td>
            </tr>
            <tr style="font-size: 12px">
              <td colspan="2" align="center" height="16">总 {{registerAllData.SaleOrderItems.length}} 笔</td>
              <td colspan="6" align="left" style="padding: 0 10px;font-weight: bold">{{index === pages ? '全部总计：￥' + sumCountAll(registerAllData.SaleOrderItems) +
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大写：' + sumChinese(sumCountAll(registerAllData.SaleOrderItems)) : ''}}</td>
              <td colspan="2" align="center">本页合计：{{sumCount(index)}}</td>
            </tr>
            </tbody>
          </table>
          <div>
            <div style="display: inline-block;width: 30%;text-align: left">创建人：{{registerAllData.DoctorName}}</div>
            <div style="display: inline-block;width: 25%;text-align: right">出库人：{{registerAllData.OrderLevelName}}</div>
            <div style="display: inline-block;width: 40%;text-align: right;">第 {{index}} 页，共 {{pages}} 页</div>
          </div>
          <div style="page-break-after: always"></div>
        </div>
      </div>

    </div>

    <div style="text-align: right">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chenxiPrint('printRecipel')">药方</el-button>
        <el-button type="primary" @click="chenxiPrint('printCashier')">收银小票补打</el-button>
        <el-button type="primary" @click="chenxiPrint('printOutStock')">出库单(财务)</el-button>
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
      dataListLoading: false,

      registerAllData: '', // 挂号单全部信息
      dataForm: {
        PaymentWay: 1 // 支付方式
      },
      pages: 1 // 打印循环 相关参数
    }
  },
  watch: {
    'registerAllData.SaleOrderItems': function (val, oldval) {
      this.pages = parseInt(val.length / 10 + 1) // 循环打印相关参数
      if (val.length !== 0 && (val.length % 10) === 0) {
        this.pages-- // 针对刚好10条那种
      }
    }
  },
  methods: {
    // 打印页，每页的合计金额
    sumCount (n) {
      return this.registerAllData.SaleOrderItems.slice((n - 1) * 10, n * 10).map(item => item.SalePrice * item.Quantity).reduce((pren, nextm) => pren + nextm).toFixed(2)
    },
    // 所有页的合计金额
    sumCountAll (arr) {
      return arr.map(item => item.SalePrice * item.Quantity).reduce((pren, nextm) => pren + nextm).toFixed(2)
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
            // console.log('查看', result.data)
          }
        })
      }
    },
    handleClose () {
      this.dataForm = {
        PaymentWay: 1 // 支付方式
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
.registerIndex /deep/ .el-form-item {
  margin-bottom: 0;
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
