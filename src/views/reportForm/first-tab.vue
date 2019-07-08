<template>
  <el-container class="day-report-form" v-loading="dataListLoading">
    <!--左-->
    <el-aside width="650px">
      <div class="mode-one" style="padding: 15px 0">
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

      <table border="1" cellspacing="0" style="border-collapse: collapse;text-align: center" width="600px">
        <caption style="height: 30px;line-height: 30px;font-weight: 700;text-align: left;font-size: 16px">账目核对：</caption>
        <tr height="30">
          <td width="100">总金额</td>
          <td colspan="5" align="left" style="padding-left: 15px">{{dataList.OrderAmount}}</td>
        </tr>
        <tr height="30">
          <td width="100">应收金额</td>
          <td width="100" align="center">{{dataList.OrderAmount}}</td>
          <td width="100">实收金额</td>
          <td width="100" align="center">{{dataList.OrderAmount}}</td>
          <td width="100">挂账金额</td>
          <td width="100" align="center" bgcolor="#ffd700">{{dataList.OnAccountAmount}}</td>
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
          <td width="100" align="left">？？？</td>
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
        </tr>
        <tr height="25">
          <td width="100">挂号费</td>
          <td width="100">{{dataList.RegisterAmount}}</td>
          <td width="100">{{dataList.YBRegisterAmount}}</td>
          <td width="100">{{dataList.ZFRegisterAmount}}</td>
          <td width="100">{{dataList.RegisterMemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100">中药费</td>
          <td width="100">{{dataList.CNDrugAmount}}</td>
          <td width="100">{{dataList.YBCNDrugAmount}}</td>
          <td width="100">{{dataList.ZFCNDrugAmount}}</td>
          <td width="100">{{dataList.CNDrugMemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100">西药费</td>
          <td width="100">{{dataList.ENDrugAmount}}</td>
          <td width="100">{{dataList.YBENDrugAmount}}</td>
          <td width="100">{{dataList.ZFENDrugAmount}}</td>
          <td width="100">{{dataList.ENDrugMemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100">加工费</td>
          <td width="100">{{dataList.WorkAmount}}</td>
          <td width="100">{{dataList.YBWorkAmount}}</td>
          <td width="100">{{dataList.ZFWorkAmount}}</td>
          <td width="100">{{dataList.WorkMemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100">代煎</td>
          <td width="100">{{dataList.DJAmount}}</td>
          <td width="100">{{dataList.YBDJAmount}}</td>
          <td width="100">{{dataList.ZFDJAmount}}</td>
          <td width="100">{{dataList.DJMemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100">快递</td>
          <td width="100">{{dataList.ExpressAmount}}</td>
          <td width="100">{{dataList.YBExpressAmount}}</td>
          <td width="100">{{dataList.ZFExpressAmount}}</td>
          <td width="100">{{dataList.ExpressMemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100">产品</td>
          <td width="100">{{dataList.ProductAmount}}</td>
          <td width="100">{{dataList.YBProductAmount}}</td>
          <td width="100">{{dataList.ZFProductAmount}}</td>
          <td width="100">{{dataList.ProductMemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100" bgcolor="#ffd700">理疗科（本部）</td>
          <td width="100">{{dataList.LLAmount}}</td>
          <td width="100">{{dataList.YBLLAmount}}</td>
          <td width="100">{{dataList.ZFLLAmount}}</td>
          <td width="100">{{dataList.LLMemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100" bgcolor="#ffd700">小儿推拿（本部）</td>
          <td width="100">{{dataList.ChildAmount}}</td>
          <td width="100">{{dataList.YBChildAmount}}</td>
          <td width="100">{{dataList.ZFChildAmount}}</td>
          <td width="100">{{dataList.ChildMemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100" bgcolor="#ffd700">美容科（本部）</td>
          <td width="100">{{dataList.CosmetologyAmount}}</td>
          <td width="100">{{dataList.YBCosmetologyAmount}}</td>
          <td width="100">{{dataList.ZFCosmetologyAmount}}</td>
          <td width="100">{{dataList.CosmetologyMemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100" bgcolor="#ffd700">康复科（陈国正）</td>
          <td width="100">{{dataList.Recovered1Amount}}</td>
          <td width="100">{{dataList.YBRecovered1Amount}}</td>
          <td width="100">{{dataList.ZFRecovered1Amount}}</td>
          <td width="100">{{dataList.Recovered1MemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100" bgcolor="#ffd700">康复科1（毛泰）</td>
          <td width="100">{{dataList.Recovered2Amount}}</td>
          <td width="100">{{dataList.YBRecovered2Amount}}</td>
          <td width="100">{{dataList.ZFRecovered2Amount}}</td>
          <td width="100">{{dataList.Recovered2MemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100" bgcolor="#ffd700">线上</td>
          <td width="100">{{dataList.OnlineAmount}}</td>
          <td width="100">{{dataList.YBOnlineAmount}}</td>
          <td width="100">{{dataList.ZFOnlineAmount}}</td>
          <td width="100">{{dataList.OnlineMemberCount}}</td>
        </tr>
        <tr height="25">
          <td width="100" bgcolor="#ffd700">美团</td>
          <td width="100">{{dataList.MeiTuanAmount}}</td>
          <td width="100">{{dataList.YBMeiTuanAmount}}</td>
          <td width="100">{{dataList.ZFMeiTuanAmount}}</td>
          <td width="100">{{dataList.MeiTuanMemberCount}}</td>
        </tr>
      </table>
    </el-aside>

    <!--右-->
    <el-main>
      <el-row>
        <el-col :span="24">
          <div ref="container" style="width: 100%;min-width:650px; max-width: 750px;height: 400px;"></div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <!--<first-tab-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></first-tab-add-or-update>-->
</template>
<script type="text/ecmascript-6">
import API from '@/api'
import FirstTabAddOrUpdate from './first-tab-add-or-update'
import { mapGetters } from 'vuex'
import { calcAge } from '@/utils/validate'
import { echarts } from '../common/echarts.min.js'
export default {
  components: { FirstTabAddOrUpdate },
  name: 'stockFirst',
  props: ['fatherDataForm'],
  data () {
    return {
      chenxiHeight: document.documentElement['clientHeight'] - 303, // 心累，不要动
      addOrUpdateVisible: false,
      dataListLoading: false, // 加载

      dataList: {},
      // 图表参数
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
            res += params.name + ' <br/> ' + params.value + '&nbsp;元<br/>'
                + '占比&nbsp;' + params.percent + '%'
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
          label: {
            normal: {
              formatter: '{b|{b}：\n} {c}￥{per|{d}%}',
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
      }

    }
  },
  mounted () {
    window.onresize = () => {
      this.chenxiHeight = document.documentElement['clientHeight'] - 303 // 273 测试老半天
      this.showEcharts()
    }
    this.showEcharts()
  },
  methods: {
    showEcharts () {
      var dom = this.$refs.container
      var myChart = echarts.init(dom)
      var app = {}
      if (this.echartsOption && typeof this.echartsOption === 'object') {
        myChart.resize()
        myChart.setOption(this.echartsOption, true)
      }
    },
    // 这个是查询某门店当日的：患者全部挂号列表
    getDataList () {
      this.dataListLoading = true
      var params = {
        StoreId: this.$store.getters.getAccountCurrentHandleStore, // 当前门店
        StartDay: this.fatherDataForm.StartDate, // 开始时间
        EndDay: this.fatherDataForm.EndDate // 结束时间
      }
      // 获取挂号列表
      console.log(params)
      API.report.getDayReport(params).then(result => {
        if (result.code === '0000') {
          console.log(result.data)
          this.dataList = result.data

          this.echartsOption.series[0].data = [
            {value: result.data.Cash, name: '现金'},
            {value: result.data.AliPay, name: '支付宝'},
            {value: result.data.WechatPay, name: '微信扫码'},
            {value: result.data.UnionPay, name: '银行卡'},
            {value: result.data.MedicalPay, name: '医保'},
            {value: result.data.WechatPhonePay, name: '客服手机'},
            {value: result.data.CouponPay, name: '代金券'},
            {value: result.data.Cash, name: '会员卡'}]
        } else {
          this.$message.error(result.message)
        }
        this.dataListLoading = false
        this.showEcharts()
      })
    },
    addOrUpdateHandle (formId) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(formId)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mode-one /deep/ {
  span { font-size: 14px}
}
</style>
