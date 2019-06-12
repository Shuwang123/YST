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
          <!--<el-col :span="12" style="font-size: 16px;">RP：[{{registerAllData.StatusName}}]</el-col> 下面行写了个vif，控制台报错找不0属性，后来加了v-if-->
          <el-col :span="12" v-if="registerAllData.SaleOrderItems">RP：{{registerAllData.SaleOrderItems[0].CategoryName.substring(4)}}</el-col>
          <el-col :span="12" style="text-align: right;padding-right: 15px">{{registerAllData.SaleOrderItems ? registerAllData.SaleOrderItems.length : ''}} 味</el-col>
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
            <!--<el-col :span="24">帖数：一剂 ￥{{registerAllData.TotalAmount}}，共 {{registerAllData.Total}} 剂，挂号费 ￥{{registerAllData.RegisterAmount}}，诊疗费 ￥{{registerAllData.ConsultationAmount}}，总金额 ￥{{registerAllData.OrderAmount}}</el-col>-->
            <el-col :span="24">帖数：一剂 ￥{{registerAllData.TotalAmount}}，共 {{registerAllData.Total}} 剂，订单总价 ￥{{registerAllData.OrderAmount}}</el-col>
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

        <div id="chenxiPrint" style="display: none">
          <table width="100%" style="font-size: 12px">

            <!--头部-->
            <tbody>
              <tr>
                <td>处方编号：<span v-text="registerAllData.Code"></span></td>
                <td colspan="2" align="right">订单时间：<span v-text="registerAllData.CreatedOnTime"></span></td>
              </tr>
              <tr>
                <td height="50" style="font-size: 20px;margin: 20px 0"><b>{{registerAllData.StoreName}}处方笺</b></td>
              </tr>
              <tr height="26">
                <td>患者信息：{{registerAllData.UserName}} {{registerAllData.SexName ? registerAllData.SexName : '__'}} {{registerAllData.BirthDate}}</td>
                <td width="50%">
                  <p style="padding-left: 70px">科室：<span>{{registerAllData.DepartmentTypeName}}</span></p>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div style="position: relative;margin-left: 60px;border-bottom: 1px solid #333">
                    <span style="position: absolute;bottom: 0;left: -60px; width: 60px">诊断结果：</span>
                    <p style="margin-bottom: 3px">{{registerAllData.DiseaseInfo ? registerAllData.DiseaseInfo : '空'}}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td v-if="registerAllData.SaleOrderItems">RP：{{registerAllData.SaleOrderItems[0].CategoryName.substring(4)}}</td>
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
                      <span style="display: inline-block;">{{item.RefundableQty}}</span> {{item.Unit}}
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
                    <p>一剂 ￥{{registerAllData.TotalAmount}}，共 {{registerAllData.Total}} 剂，订单总价 ￥{{registerAllData.OrderAmount}}</p>
                  </div>
                </td>
              </tr>
              <tr valign="top">
                <td width="48%">
                  <div style="position: relative;margin-left: 36px">
                    <span style="position: absolute;top: 0;left: -36px; width: 36px">用法：</span>
                    <p>{{registerAllData.DrugRate}}jdaljflj警方拉上来的房间啦手机放到了</p>
                  </div>
                </td>
                <td width="48%" style="margin-left: 4%">
                  <div style="position: relative;margin-left: 98px">
                    <span style="position: absolute;top: 0;left: -48px; width: 48px">收货人：</span>
                    <p>{{registerAllData.UserName}} {{registerAllData.MobilePhone}}</p>
                  </div>
                </td>
              </tr>
              <tr valign="top">
                <td width="48%">
                  <div style="position: relative;margin-left: 36px">
                    <span style="position: absolute;top: 0;left: -36px; width: 36px">医嘱：</span>
                    <p>{{registerAllData.DoctorAdvice}}jdaljflj警方拉上来的房间啦手机放到了</p>
                  </div>
                </td>
                <td width="48%" style="margin-left: 4%">
                  <div style="position: relative;margin-left: 96px">
                    <span style="position: absolute;top: 0;left: -36px; width: 36px">地址：</span>
                    <p>{{registerAllData.Address}}爱上的发顺丰大声的发生的发生的发生的发生的发生地方</p>
                  </div>
                </td>
              </tr>
              <tr>

              <!--签字-->
              <tr>
                <td height="26">医生：<span v-text="registerAllData.Code">{{registerAllData.DoctorName}}</span></td>
                <td colspan="2"><p style="padding-left: 50px">审核：<span></span></p></td>
              </tr>
              <tr>
                <td height="26">调配：<span></span></td>
                <td colspan="2"><p style="padding-left: 50px">核发：<span></span></p></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--&lt;!&ndash;cx新增start&ndash;&gt;vertical-align: bottom;-->
        <!--<div id="chenxiPrint" style="padding: 20px 15px;display: none;">-->
          <!--<ul style="list-style-type: none;background-color: #fff;overflow: hidden;margin: 0;padding: 0">-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left">-->
              <!--<span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">订单时间未付款</span><br>-->
              <!--<span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">药品类型饮片</span>-->
            <!--</li>-->
            <!--<li style="width: 50%;height: 60px;line-height: 60px;float: left">-->
              <!--<img width="140" height="57" style="margin-left: 20px">-->
            <!--</li>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">姓名</span></li>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">手机号</span></li>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">性别</span>女</li>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">年龄</span></li>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">诊断结果</span></li>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">付数</span></li>-->
            <!--<li style="width: 100%;margin-bottom: 5px"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">服药说明</span><b style="border-bottom: 1px solid #000;display: inline-block;width: 70%;min-height: 20px;vertical-align: bottom;font-weight: 400"></b></li>-->
            <!--<ol style="list-style-type: none;margin: 0;padding: 0 0 0 5%;overflow: hidden;clear: both;min-height: 210px">-->
              <!--<li style="width: 15%;height: 25px;line-height: 25px;float: left;text-align: right;"></li>-->
              <!--<li style="width: 15%;height: 25px;line-height: 25px;float: left;text-align: left;margin-left: 5px"></li>-->
            <!--</ol>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">收货人</span></li>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">手机</span></li>-->
            <!--<li style="width: 100%;height: 30px;line-height: 30px;clear: both"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">收货地址</span>{$order.address}</li>-->
            <!--<li style="width: 100%;height: 30px;line-height: 30px;"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">固定座机</span>如有疑问请随时联系善郎中助理：023-67603551（周1~7 08:30~20:30）</li>-->
            <!--<li style="width: 100%;height: 30px;line-height: 30px;"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">其他时间</span>请联系：17823775224、19922937120</li>-->
            <!--<li style="width: 50%;float: left;text-align: center;min-height: 90px;line-height: 0;"><p style="margin: 3px 0">公众号</p><img width="70" height="70"></li>-->
            <!--<li style="width: 50%;float: left;text-align: center;min-height: 90px;"><p style="margin: 3px 0">客服微信</p><img width="70" height="70"></li>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">医生</span></li>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">审方</span></li>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">调配</span></li>-->
            <!--<li style="width: 50%;height: 30px;line-height: 30px;float: left"><span style="display: inline-block;width: 64px;margin-right: 10px;text-align: right">发药</span></li>-->
          <!--</ul>-->
        <!--</div>-->
      </el-aside>

      <el-main>
        <div class="ownScrollbar" style="min-height: 390px;overflow-y: scroll;"
             v-loading="dataListLoading">
          <div style="">
            <el-row>
              <el-col :span="24">病历号：{{registerAllData.UserCode}}</el-col>
            </el-row>
          </div>

          <el-row>
            <el-col><div style="padding-top: 5px;font-size: 16px;font-weight: 900;color: #1CA579">收费项目：</div></el-col>
          </el-row>
          <div style="padding-left: 32px">
            <!--表头-->
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
              <el-col :span="6">{{registerAllData.TotalAmount * registerAllData.Total}}￥</el-col>
              <el-col :span="6">{{registerAllData.StatusName ? registerAllData.StatusName : '无'}}</el-col>
              <el-col :span="6">
                <!--<span style="color: #409EFF;cursor: pointer;text-align: center">- -</span>-->
                <span @click="seeRecipelInfo" style="color: #409EFF;cursor: pointer;text-align: center">{{isAddActive === false ? '处方' : '处方'}}详情</span>
              </el-col>
            </el-row>
          </div>

          <el-form ref="dataForm" :rules="dataRule" :model="dataForm" label-width="70px" size="mini" :inline="true">
            <el-row style="margin-top: 30px;text-align: left;font-weight: 500; font-size: 16px">
              <el-col :span="12">
                <el-form-item label="待收金额">
                  <el-input v-model="residualPrice" placeholder="总金额" style="width: 100px" disabled size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="折扣率">
                  <el-select v-model="dazhe" style="width: 100px">
                    <el-option v-for="item in dazheArr" :key="item.value"
                               :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="代煎">
                  <el-input v-model="daijian" style="width: 100px" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="制丸">
                  <el-input v-model="zhiwan" style="width: 100px" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="快递">
                  <el-input v-model="kuaidi" style="width: 100px" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="其他">
                  <el-input v-model="qita" style="width: 100px" size="small"></el-input>
                  <!--<el-input-number v-model="dataForm.reality" :max="10" label="描述文字"></el-input-number>-->
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
                <el-form-item label="实收" prop="reality">
                  <el-input @blur="realityBlur" v-model="dataForm.reality" style="width: 100px" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="找零" prop="give">
                  <el-input v-model="dataForm.give" style="width: 100px" clearable size="small" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </div>
      </el-main>

    </el-container>

    <div style="text-align: right">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dataFormSubmitA()">确认收费并打印</el-button>
        <el-button type="primary" @click="chenxiPrint()">直接打印</el-button>
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
      dataRule: {
        reality: Currency('此为必填项')
      },
      optionsPaymentType: [ // 患者支付类型
        {
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
      dazhe: 1.00,
      dazheArr: [ // 打折options模版
        {
          value: 1.00,
          label: '不打折'
        }, {
          value: 0.95,
          label: '95折'
        }, {
          value: 0.90,
          label: '9折'
        }, {
          value: 0.80,
          label: '8折'
        }, {
          value: 0.70,
          label: '7折'
        }
      ],
      daijian: 0,
      zhiwan: 0,
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
          if (this.dataForm.reality === 0 && this.residualPrice > 0) {
            this.$alert('实收金额未填! ', '提示', {
              confirmButtonText: '确定'
            })
            return false
          }
          var params = {
            id: this.registerAllData.Id,
            PaymentWay: this.dataForm.PaymentWay, // 支付方式
            ActualAmount: this.residualPrice // 实收金额 this.dataForm.reality 不是这个
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
    }
    // 打印功能结束

  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.charge-info /deep/ .el-form-item {
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
