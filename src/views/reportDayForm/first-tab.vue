<template>
  <el-container class="day-report-form" v-loading="dataListLoading">
    <!--左 v-show="dataList.MemberCount !== undefined"-->
    <el-aside width="650px">
      <el-form :model="dataList" ref="numberValidateForm" class="demo-ruleForm">
        <div class="mode-one" style="margin: 15px 0">
          <b style="font-size: 16px;">门诊患者：</b>
          <el-badge :value="dataList.ConsultationMemberCount+'人'" :max="99" class="item" style="margin-right: 50px;margin-left: 40px">
            <el-button type="text" size="small">累计就诊</el-button>
          </el-badge>
          <el-badge :value="dataList.MemberCount+'人'" :max="100" class="item" style="margin-right: 50px">
            <el-button type="text" size="small">累计会员</el-button>
          </el-badge>
          <el-badge :value="dataList.AddMenberCount+'人'" :max="100" class="item" style="margin-right: 50px">
            <el-button type="text" size="small">新增会员</el-button>
          </el-badge>
          <el-badge :value="dataList.FirstDiagnosisType+'人'" :max="100" class="item" style="margin-right: 50px">
            <el-button type="text" size="small">初诊</el-button>
          </el-badge>
          <el-badge :value="dataList.AgainDiagnosisType+'人'" :max="100" class="item" style="margin--right: 5px">
            <el-button type="text" size="small">复诊</el-button>
          </el-badge>
        </div>

        <div id="dayReportForm">
          <div v-show="timeShow">时间：{{fatherDataForm.StartDate}} 到 {{fatherDataForm.EndDate}}</div>
          <table border="1" cellspacing="0" style="border-collapse: collapse;text-align: center" width="600px">
            <caption style="height: 30px;line-height: 30px;font-weight: 700;text-align: left;font-size: 16px">账目核对：</caption>
            <tr height="30">
              <td width="100">总金额</td>
              <td colspan="2" align="left" style="padding-left: 15px">{{Number(dataList.OrderAmount-rodataList.OrderAmount).toFixed(2)}}</td>
              <td width="100">退单总金额</td>
              <td colspan="2" align="left" style="padding-left: 15px">{{Number(rodataList.OrderAmount).toFixed(2)}}</td>
            </tr>
            <tr height="30">
              <td width="100">应收金额</td>
              <td width="100" align="center">{{dataList.OrderAmount}}</td>
              <td width="100">实收金额</td>
              <td width="100" align="center">{{dataList.OrderAmount}}</td>
              <td width="100" bgcolor="#f1f2f7">挂账金额</td>
              <td width="100" v-if="!isEditing" align="center">{{dataList.OnAccountAmount}}</td>
              <td width="100" v-else align="center">
                <el-form-item prop="OnAccountAmount" :rules="numRules">
                  <el-input v-model.number="dataList.OnAccountAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>

          <table border="1" cellspacing="0" style="border-collapse: collapse;text-align: center" width="600px">
            <caption style="height: 30px;line-height: 30px;font-weight: 700;text-align: left;font-size: 16px">收费方式：</caption>
            <tr height="30">
              <td width="100">现金</td>
              <td width="100" align="left">{{dataList.Cash}}</td>
              <td width="100">支付宝</td>
              <td width="100" align="left">{{dataList.AliPay}}</td>
              <td width="100">微信扫码</td>
              <td width="100" align="left">{{dataList.WechatPay}}</td>
              <td width="100">银行卡</td>
              <td width="100" align="left">{{dataList.UnionPay}}</td>
            </tr>
            <tr height="30">
              <td width="100">医保</td>
              <td width="100" align="left">{{dataList.MedicalPay}}</td>
              <td width="100">客服手机</td>
              <td width="100" align="left">{{dataList.WechatPhonePay}}</td>
              <td width="100">代金券</td>
              <td width="100" align="left">{{dataList.CouponPay}}</td>
              <td width="100">会员卡</td>
              <td width="100" align="left">{{dataList.MemberPay}}</td>
            </tr>
            <tr height="30">
              <td width="100">白露</td>
              <td width="100" align="left">{{dataList.BaiLu}}</td>
              <td width="100">万科</td>
              <td width="100" align="left">{{dataList.WangKe}}</td>
              <td width="100">善郎中</td>
              <td width="100" align="left">{{dataList.SLZ}}</td>
              <td width="100">美团</td>
              <td width="100" align="left">{{dataList.MT}}</td>
            </tr>
            <tr height="30">
              <td width="100">经脉宝</td>
              <td width="100" align="left">{{dataList.JMB}}</td>
            </tr>
          </table>

          <table border="1" cellspacing="0" style="border-collapse: collapse;text-align: center" width="600px">
            <caption style="height: 30px;line-height: 30px;font-weight: 700;text-align: left;font-size: 16px">收费明细：</caption>
            <tr height="30">
              <th width="100">收费项目</th>
              <th width="100">总金额</th>
              <th width="100">医保金额</th>
              <th width="100">自费金额</th>
              <th width="100">人次</th>
              <th width="100">退费金额</th>
            </tr>
            <tr height="25">
              <td width="100">挂号费</td>
              <td width="100">{{dataList.RegisterAmount}}</td>
              <td width="100">{{dataList.YBRegisterAmount}}</td>
              <td width="100">{{dataList.ZFRegisterAmount}}</td>
              <td width="100">{{dataList.RegisterMemberCount}}</td>
              <td width="100">0</td>
            </tr>
            <!--<tr height="25">-->
              <!--<td width="100">中药费</td>-->
              <!--<td width="100">{{dataList.CNDrugAmount}}</td>-->
              <!--<td width="100">{{dataList.YBCNDrugAmount}}</td>-->
              <!--<td width="100">{{dataList.ZFCNDrugAmount}}</td>-->
              <!--<td width="100">{{dataList.CNDrugMemberCount}}</td>-->
            <!--</tr>-->
            <tr height="25">
              <td width="100">饮片</td>
              <td width="100">{{Number(dataList.CNDrugYPAmount-rodataList.CNDrugYPAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.YBCNDrugYPAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.ZFCNDrugYPAmount).toFixed(2)}}</td>
              <td rowspan="4" width="100">{{dataList.CNDrugMemberCount}}</td>
              <td width="100">{{Number(rodataList.CNDrugYPAmount).toFixed(2)}}</td>
            </tr>
            <tr height="25">
              <td width="100">精品饮片</td>
              <td width="100">{{Number(dataList.CNDrugJBYPAmount-rodataList.CNDrugJBYPAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.YBCNDrugJBYPAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.ZFCNDrugJBYPAmount).toFixed(2)}}</td>
              <!--<td width="100">{{dataList.CNDrugJBYPMemberCount}}</td>-->
              <td width="100">{{Number(rodataList.CNDrugJBYPAmount).toFixed(2)}}</td>
            </tr>
            <tr height="25">
              <td width="100">饮片3</td>
              <td width="100">{{Number(dataList.CNDrugYP3Amount-rodataList.CNDrugYP3Amount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.YBCNDrugYP3Amount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.ZFCNDrugYP3Amount).toFixed(2)}}</td>
              <!--<td width="100">{{dataList.CNDrugYP3MemberCount}}</td>-->
              <td width="100">{{Number(rodataList.CNDrugYP3Amount).toFixed(2)}}</td>
            </tr>
            <tr height="25">
              <td width="100">贵细</td>
              <td width="100">{{Number(dataList.CNDrugGXAmount-rodataList.CNDrugGXAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.YBCNDrugGXAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.ZFCNDrugGXAmount).toFixed(2)}}</td>
              <td width="100">{{Number(rodataList.CNDrugGXAmount).toFixed(2)}}</td>
              <!--<td width="100">{{dataList.CNDrugGXMemberCount}}</td>-->
            </tr>
            <tr height="25">
              <td width="100">理疗</td>
              <td width="100">{{Number(dataList.LLFAmount-rodataList.LLFAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.YBLLFAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.ZFLLFAmount).toFixed(2)}}</td>
              <td width="100">{{dataList.LLFMemberCount}}</td>
              <td width="100">{{Number(rodataList.LLFAmount).toFixed(2)}}</td>
            </tr>

            <tr height="25">
              <td width="100">西药费</td>
              <td width="100">{{Number(dataList.ENDrugAmount-rodataList.ENDrugAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.YBENDrugAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.ZFENDrugAmount).toFixed(2)}}</td>
              <td width="100">{{dataList.ENDrugMemberCount}}</td>
              <td width="100">{{Number(rodataList.ENDrugAmount).toFixed(2)}}</td>
            </tr>
            <tr height="25">
              <td width="100">加工费</td>
              <td width="100">{{dataList.WorkAmount}}</td>
              <td width="100">{{dataList.YBWorkAmount}}</td>
              <td width="100">{{dataList.ZFWorkAmount}}</td>
              <td width="100">{{dataList.WorkMemberCount}}</td>
              <td width="100">0</td>
            </tr>
            <tr height="25">
              <td width="100">代煎</td>
              <td width="100">{{dataList.DJAmount}}</td>
              <td width="100">{{dataList.YBDJAmount}}</td>
              <td width="100">{{dataList.ZFDJAmount}}</td>
              <td width="100">{{dataList.DJMemberCount}}</td>
              <td width="100">0</td>
            </tr>
            <tr height="25">
              <td width="100">快递</td>
              <td width="100">{{dataList.ExpressAmount}}</td>
              <td width="100">{{dataList.YBExpressAmount}}</td>
              <td width="100">{{dataList.ZFExpressAmount}}</td>
              <td width="100">{{dataList.ExpressMemberCount}}</td>
              <td width="100">0</td>
            </tr>
            <tr height="25">
              <td width="100">其他费用</td>
              <td width="100">{{dataList.OtherAmount}}</td>
              <td width="100">{{dataList.YBOtherAmount}}</td>
              <td width="100">{{dataList.ZFOtherAmount}}</td>
              <td width="100">{{dataList.OtherMemberCount}}</td>
              <td width="100">0</td>
            <tr height="25">
              <td width="100">产品</td>
              <td width="100">{{Number(dataList.ProductAmount-rodataList.ProductAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.YBProductAmount).toFixed(2)}}</td>
              <td width="100">{{Number(dataList.ZFProductAmount).toFixed(2)}}</td>
              <td width="100">{{dataList.ProductMemberCount}}</td>
              <td width="100">{{Number(rodataList.ProductAmount).toFixed(2)}}</td>
            </tr>
            <tr height="25" v-show="false">
              <td width="100" bgcolor="#f1f2f7">理疗科（本部）</td>
              <td width="100" v-if="!isEditing">{{dataList.LLAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.YBLLAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.ZFLLAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.LLMemberCount}}</td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="LLAmount" :rules="numRules">
                  <el-input v-model.number="dataList.LLAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="YBLLAmount" :rules="numRules">
                  <el-input v-model.number="dataList.YBLLAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="ZFLLAmount" :rules="numRules">
                  <el-input v-model.number="dataList.ZFLLAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="LLMemberCount" :rules="numRules">
                  <el-input v-model.number="dataList.LLMemberCount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr height="25" v-show="false">
              <td width="100" bgcolor="#f1f2f7">小儿推拿（本部）</td>
              <td width="100" v-if="!isEditing">{{dataList.ChildAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.YBChildAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.ZFChildAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.ChildMemberCount}}</td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="ChildAmount" :rules="numRules">
                  <el-input v-model.number="dataList.ChildAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="YBChildAmount" :rules="numRules">
                  <el-input v-model.number="dataList.YBChildAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="ZFChildAmount" :rules="numRules">
                  <el-input v-model.number="dataList.ZFChildAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="ChildMemberCount" :rules="numRules">
                  <el-input v-model.number="dataList.ChildMemberCount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr height="25" v-show="false">
              <td width="100" bgcolor="#f1f2f7">美容科（本部）</td>
              <td width="100" v-if="!isEditing">{{dataList.CosmetologyAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.YBCosmetologyAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.ZFCosmetologyAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.CosmetologyMemberCount}}</td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="CosmetologyAmount" :rules="numRules">
                  <el-input v-model.number="dataList.CosmetologyAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="YBCosmetologyAmount" :rules="numRules">
                  <el-input v-model.number="dataList.YBCosmetologyAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="ZFCosmetologyAmount" :rules="numRules">
                  <el-input v-model.number="dataList.ZFCosmetologyAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="CosmetologyMemberCount" :rules="numRules">
                  <el-input v-model.number="dataList.CosmetologyMemberCount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr height="25" v-show="false">
              <td width="100" bgcolor="#f1f2f7">康复科（陈国正）</td>
              <td width="100" v-if="!isEditing">{{dataList.Recovered1Amount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.YBRecovered1Amount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.ZFRecovered1Amount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.Recovered1MemberCount}}</td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="Recovered1Amount" :rules="numRules">
                  <el-input v-model.number="dataList.Recovered1Amount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="YBRecovered1Amount" :rules="numRules">
                  <el-input v-model.number="dataList.YBRecovered1Amount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="ZFRecovered1Amount" :rules="numRules">
                  <el-input v-model.number="dataList.ZFRecovered1Amount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="Recovered1MemberCount" :rules="numRules">
                  <el-input v-model.number="dataList.Recovered1MemberCount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr height="25" v-show="false">
              <td width="100" bgcolor="#f1f2f7">康复科1（毛泰）</td>
              <td width="100" v-if="!isEditing">{{dataList.Recovered2Amount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.YBRecovered2Amount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.ZFRecovered2Amount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.Recovered2MemberCount}}</td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="Recovered2Amount" :rules="numRules">
                  <el-input v-model.number="dataList.Recovered2Amount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="YBRecovered2Amount" :rules="numRules">
                  <el-input v-model.number="dataList.YBRecovered2Amount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="ZFRecovered2Amount" :rules="numRules">
                  <el-input v-model.number="dataList.ZFRecovered2Amount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="Recovered2MemberCount" :rules="numRules">
                  <el-input v-model.number="dataList.Recovered2MemberCount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr height="25" v-show="false">
              <td width="100" bgcolor="#f1f2f7">线上</td>
              <td width="100" v-if="!isEditing">{{dataList.OnlineAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.YBOnlineAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.ZFOnlineAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.OnlineMemberCount}}</td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="OnlineAmount" :rules="numRules">
                  <el-input v-model.number="dataList.OnlineAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="YBOnlineAmount" :rules="numRules">
                  <el-input v-model.number="dataList.YBOnlineAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="ZFOnlineAmount" :rules="numRules">
                  <el-input v-model.number="dataList.ZFOnlineAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="OnlineMemberCount" :rules="numRules">
                  <el-input v-model.number="dataList.OnlineMemberCount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr height="25" v-show="false">
              <td width="100" bgcolor="#f1f2f7">美团</td>
              <td width="100" v-if="!isEditing">{{dataList.MeiTuanAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.YBMeiTuanAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.ZFMeiTuanAmount}}</td>
              <td width="100" v-if="!isEditing">{{dataList.MeiTuanMemberCount}}</td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="MeiTuanAmount" :rules="numRules">
                  <el-input v-model.number="dataList.MeiTuanAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="YBMeiTuanAmount" :rules="numRules">
                  <el-input v-model.number="dataList.YBMeiTuanAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="ZFMeiTuanAmount" :rules="numRules">
                  <el-input v-model.number="dataList.ZFMeiTuanAmount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
              <td width="100" v-if="isEditing" align="center">
                <el-form-item prop="MeiTuanMemberCount" :rules="numRules">
                  <el-input v-model.number="dataList.MeiTuanMemberCount" style="width: 100px" size="mini"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
        </div>
      </el-form>
    </el-aside>

    <!--右-->
    <el-main>
      <el-row>
        <el-col :span="24">
          <div ref="container" style="width: 100%;min-width:650px; max-width: 750px;height: 400px;"></div>
          <div ref="container1" style="width: 100%;min-width:650px; max-width: 750px;height: 400px;"></div>
        </el-col>
        <el-col :span="6" :offset="18">
          <el-button size="mini" @click="editSubmit()">确认修改</el-button>
        </el-col>
        <el-col :span="24">
          <div style=""></div>
        </el-col>
        <el-col :span="24">
          <el-button size="mini" @click="chenxiPrint()">打印当前报表</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import { mapGetters } from 'vuex'
import { calcAge } from '@/utils/validate'
// import { echarts } from '../../../static/echarts.min.js'
var echarts = require('../../../static/echarts.min.js')
export default {
  name: 'stockFirst',
  props: ['fatherDataForm'],
  data () {
    return {
      chenxiHeight: document.documentElement['clientHeight'] - 303, // 心累，不要动
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载
      timeShow: false,

      isEditing: false, // 编辑
      // 输入验证
      numRules: [{required: true, message: '必填'},
        {type: 'number', message: '输入必须为数字值'}],

      dataList: {},
      rodataList: {}, // 退单总金额
      // charts参数
      echartsOption: {
        title: {
          text: '支付金额占比',
          subtext: '饼图展示',
          formatter: '{b}<br/> {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'middle',
          data: ['现金', '支付宝', '微信扫码', '银行卡', '医保', '客服手机', '代金券', '会员卡']
        },
        toolbox: {
          show: true,
          // orient: 'vertical',
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: [0, 10],
          textStyle: {
            color: '#fff',
            fontSize: 14,
            lineHeight: '14px'
          },
          position: function (point, params, dom, rect, size) {
            return [point[0] + 10, point[1] - dom.offsetHeight - 10]
          },
          formatter: function (params) {
            var res = ''
            res += params.name + ' <br/> ' + params.value + '&nbsp;元<br/>' + '占比&nbsp;' + params.percent + '%'
            // console.log(params)
            return res
          }
        },

        series: [{
          name: '',
          type: 'pie',
          // center: ['79%', '19%'],
          radius: ['0%', '55%'],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.8)'
            }
          },
          labelLine: {

          },
          label: {
            normal: {
              formatter: '{b|{b}}：\n {c}￥{per|{d}%}',
              backgroundColor: '#f1f2f7',
              borderColor: '#eee',
              borderWidth: 1,
              borderRadius: 4,
              shadowBlur: 1, // 水玉度
              shadowOffsetX: 1,
              shadowOffsetY: 1,
              shadowColor: '#999',
              padding: [0, 7],
              rich: {
                b: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  align: 'right',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          data: [
            {value: 0, name: '现金'},
            {value: 0, name: '支付宝'},
            {value: 0, name: '微信扫码'},
            {value: 0, name: '银行卡'},
            {value: 0, name: '医保'},
            {value: 0, name: '客服手机'},
            {value: 0, name: '代金券'},
            {value: 0, name: '会员卡'}
          ]
        } ]
      },
      echartsOption1: {
        title: {
          text: '收费明细占比',
          subtext: '饼图展示',
          formatter: '{b}<br/> {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'middle',
          data: ['挂号费', '饮片', '精品饮片', '饮片3', '贵细', '理疗', '西药费', '产品']
        },
        toolbox: {
          show: true,
          // orient: 'vertical',
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: [0, 10],
          textStyle: {
            color: '#fff',
            fontSize: 14,
            lineHeight: '14px'
          },
          position: function (point, params, dom, rect, size) {
            return [point[0] + 10, point[1] - dom.offsetHeight - 10]
          },
          formatter: function (params) {
            var res = ''
            res += params.name + ' <br/> ' + params.value + '&nbsp;元<br/>' + '占比&nbsp;' + params.percent + '%'
            // console.log(params)
            return res
          }
        },

        series: [{
          name: '',
          type: 'pie',
          // center: ['79%', '19%'],
          radius: ['0%', '55%'],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.8)'
            }
          },
          labelLine: {

          },
          label: {
            normal: {
              formatter: '{b|{b}}：\n {c}￥{per|{d}%}',
              backgroundColor: '#f1f2f7',
              borderColor: '#eee',
              borderWidth: 1,
              borderRadius: 4,
              shadowBlur: 1, // 水玉度
              shadowOffsetX: 1,
              shadowOffsetY: 1,
              shadowColor: '#999',
              padding: [0, 7],
              rich: {
                b: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  align: 'right',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          data: [
            {value: 0, name: '挂号费'},
            {value: 0, name: '饮片'},
            {value: 0, name: '精品饮片'},
            {value: 0, name: '饮片3'},
            {value: 0, name: '贵细'},
            {value: 0, name: '理疗'},
            {value: 0, name: '西药费'},
            {value: 0, name: '产品'}
          ]
        } ]
      }

    }
  },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 303 // 273 测试老半天
      this.showEcharts()
    }
  },
  methods: {
    showEcharts () {
      var dom = this.$refs.container
      var dom1 = this.$refs.container1
      var myChart = echarts.init(dom)
      var myChart1 = echarts.init(dom1)
      if (this.echartsOption && typeof this.echartsOption === 'object') {
        myChart.resize()
        myChart.setOption(this.echartsOption, true)
      }
      if (this.echartsOption1 && typeof this.echartsOption1 === 'object') {
        myChart1.resize()
        myChart1.setOption(this.echartsOption1, true)
      }
    },
    // 这个是查询某门店当日的：患者全部挂号列表
    getDataList () {
      this.dataListLoading = true
      var paramsOffset = {
        StoreId: this.$store.getters.getAccountCurrentHandleStore,
        OrderType: 2,
        StartDay: this.fatherDataForm.StartDate,
        EndDay: this.fatherDataForm.EndDate,
        Source: this.fatherDataForm.Source
      }
      var paramsDayReport = {
        StoreId: this.$store.getters.getAccountCurrentHandleStore, // 当前门店
        OrderType: 1, // 1表示销售单 2表示销售退单
        StartDay: this.fatherDataForm.StartDate, // 开始时间
        EndDay: this.fatherDataForm.EndDate,
        Source: this.fatherDataForm.Source} // 结束时间
      function funOffsetReport () { return API.report.getOffsetReport(paramsOffset) }
      function funDayReport () { return API.report.getDayReport(paramsDayReport) }
      this.$ios.all([funOffsetReport(), funDayReport()]).then(
        this.$ios.spread((response, result) => {
          if (response.code === '0000' && result.code === '0000') {
            this.dataList = result.data
            console.log(result.data, response.data)
            this.rodataList = response.data
            this.echartsOption.series[0].data = [
              {value: result.data.Cash, name: '现金'},
              {value: result.data.AliPay, name: '支付宝'},
              {value: result.data.WechatPay, name: '微信扫码'},
              {value: result.data.UnionPay, name: '银行卡'},
              {value: result.data.MedicalPay, name: '医保'},
              {value: result.data.WechatPhonePay, name: '客服手机'},
              {value: result.data.CouponPay, name: '代金券'},
              {value: result.data.MemberPay, name: '会员卡'},
              {value: result.data.BaiLu, name: '白露'},
              {value: result.data.WangKe, name: '万科'},
              {value: result.data.SLZ, name: '善郎中'},
              {value: result.data.MT, name: '美团'}
            ]
            this.echartsOption1.series[0].data = [
              {value: result.data.RegisterAmount, name: '挂号费'},
              {value: result.data.CNDrugYPAmount, name: '饮片'},
              {value: result.data.CNDrugJBYPAmount, name: '精品饮片'},
              {value: result.data.CNDrugYP3Amount, name: '饮片3'},
              {value: result.data.CNDrugGXAmount, name: '贵细'},
              {value: result.data.LLFAmount, name: '理疗'},
              {value: result.data.ENDrugAmount, name: '西药费'},
              {value: result.data.ProductAmount, name: '产品'}
            ]
            this.showEcharts()
            this.dataListLoading = false
          } else {
            this.$message.error(result.message)
          }
        })
      )
    },

    // 编辑提交
    editSubmit () {
      this.$refs['numberValidateForm'].validate((valid) => {
        if (valid) {
          var params = {
            SignName: this.dataList.SignName,
            Remark: this.dataList.Remark,
            StoreId: this.$store.getters.getAccountCurrentHandleStore,
            OnAccountAmount: this.dataList.OnAccountAmount,

            LLAmount: this.dataList.LLAmount, // 理疗科(本部)总金额
            YBLLAmount: this.dataList.YBLLAmount,
            ZFLLAmount: this.dataList.ZFLLAmount,
            LLMemberCount: this.dataList.LLMemberCount,

            ChildAmount: this.dataList.ChildAmount, // 小儿推拿(本部)总金额
            YBChildAmount: this.dataList.YBChildAmount,
            ZFChildAmount: this.dataList.ZFChildAmount,
            ChildMemberCount: this.dataList.ChildMemberCount,

            CosmetologyAmount: this.dataList.CosmetologyAmount, // 美容科(吴小梅)总金额
            YBCosmetologyAmount: this.dataList.YBCosmetologyAmount,
            ZFCosmetologyAmount: this.dataList.ZFCosmetologyAmount,
            CosmetologyMemberCount: this.dataList.CosmetologyMemberCount,

            Recovered1Amount: this.dataList.Recovered1Amount, // 康复科1(陈国正)总金额
            YBRecovered1Amount: this.dataList.YBRecovered1Amount,
            ZFRecovered1Amount: this.dataList.ZFRecovered1Amount,
            Recovered1MemberCount: this.dataList.Recovered1MemberCount,

            Recovered2Amount: this.dataList.Recovered2Amount, // 康复科2(毛泰)总金额
            YBRecovered2Amount: this.dataList.YBRecovered2Amount,
            ZFRecovered2Amount: this.dataList.ZFRecovered2Amount,
            Recovered2MemberCount: this.dataList.Recovered2MemberCount,

            OnlineAmount: this.dataList.OnlineAmount, // 线上总金额
            YBOnlineAmount: this.dataList.YBOnlineAmount,
            ZFOnlineAmount: this.dataList.ZFOnlineAmount,
            OnlineMemberCount: this.dataList.OnlineMemberCount,

            MeiTuanAmount: this.dataList.MeiTuanAmount, // 美团总金额
            YBMeiTuanAmount: this.dataList.YBMeiTuanAmount,
            ZFMeiTuanAmount: this.dataList.ZFMeiTuanAmount,
            MeiTuanMemberCount: this.dataList.MeiTuanMemberCount
          }
          console.log(params)
          API.report.createDayReport(params).then(result => {
            if (result.code === '0000') {
              this.$message({
                message: `${'提交成功'}`,
                type: 'success',
                duration: 1500
              })
              this.getDataList()
              this.isEditing = false
            } else {
              this.$message.error(result.message)
            }
          })
        } else {
          this.$alert('请检查是否填写正确! ', '提示', {
            confirmButtonText: '确定'
          })
        }
      })
    },

    // 打印功能
    chenxiPrint () {
      this.timeShow = true
      this.$nextTick(() => {
        var printHTML = document.getElementById('dayReportForm').innerHTML // 获取要打印的内容
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
        this.timeShow = false
        page.close() // 关闭打印窗口
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.day-report-form /deep/ {
  .el-main {
    overflow: visible;
  }
}
</style>
